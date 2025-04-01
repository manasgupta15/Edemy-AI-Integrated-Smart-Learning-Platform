import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { protectAuth } from "../middlewares/authMiddleware.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * ✅ Create Stripe Checkout Session
 */
const MINIMUM_PRICE_INR = 50; // ₹50 (~$0.60)
router.post("/create-checkout-session", protectAuth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    console.log("Received courseId:", courseId);

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    console.log("Course found:", course.courseTitle);
    console.log("Course Price:", course.coursePrice);

    if (!course.coursePrice || isNaN(course.coursePrice)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course price" });
    }

    // ✅ Calculate final price (handle discount)
    const discount = course.discount ? course.discount / 100 : 0;
    const finalPrice = Math.round(course.coursePrice * (1 - discount) * 100); // Convert to cents

    // ✅ Enforce minimum price
    if (finalPrice < MINIMUM_PRICE_INR * 100) {
      return res.status(400).json({
        success: false,
        message: `Course price must be at least ₹${MINIMUM_PRICE_INR} (Stripe's minimum)`,
      });
    }

    // ✅ Check if user already has a pending/completed purchase
    let purchase = await Purchase.findOne({ userId, courseId });

    if (!purchase) {
      // Create a pending purchase entry
      purchase = new Purchase({
        userId,
        courseId,
        amount: finalPrice / 100, // Convert from cents
        status: "pending",
      });
      await purchase.save();
    }

    // ✅ Log user data to check for email
    console.log("User Data:", req.user);

    // ✅ Retrieve email safely
    let customerEmail = req.user.email || "";
    if (
      !customerEmail &&
      req.user.emailAddresses &&
      req.user.emailAddresses.length > 0
    ) {
      customerEmail = req.user.emailAddresses[0].emailAddress;
    }

    if (!customerEmail) {
      console.error("Error: No valid email found in user data.");
      return res.status(400).json({
        success: false,
        message: "User email is not available.",
      });
    }

    // ✅ Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              // description: course.courseDescription.replace(
              //   /(<([^>]+)>)/gi,
              //   ""
              // ),
            },
            unit_amount: finalPrice, // Price in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
      cancel_url: `${process.env.CLIENT_URL}/course/${courseId}`,
    });

    console.log("Stripe session created:", session.id);
    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment initiation failed" });
  }
});

/**
 * ✅ Confirm Payment & Enroll User
 */
router.post("/confirm-payment", protectAuth, async (req, res) => {
  try {
    const { session_id, courseId } = req.body;
    const userId = req.user.id;

    if (!session_id || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing payment details." });
    }

    console.log("Received session_id:", session_id);

    // ✅ Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log("Stripe Session Data:", session);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed or session invalid",
      });
    }

    // ✅ Check if purchase exists
    let purchase = await Purchase.findOne({ userId, courseId });

    if (!purchase) {
      // ✅ Create a new purchase record if not found
      purchase = new Purchase({
        userId,
        courseId,
        amount: session.amount_total / 100, // Convert from cents
        status: "completed",
      });
      await purchase.save();
    } else {
      // ✅ Update existing purchase record
      purchase.status = "completed";
      await purchase.save();
    }

    // ✅ Increment enrolled students count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudents: 1 } });

    res.json({
      success: true,
      message: "Payment confirmed & course enrolled!",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({
      success: false,
      message: "Payment confirmation failed",
    });
  }
});

router.post("/save-enrollment", async (req, res) => {
  try {
    const { courseId, userId, amount } = req.body;
    console.log("📩 Received Enrollment Request:", {
      courseId,
      userId,
      amount,
    });

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Missing courseId or userId" });
    }

    // ✅ Step 1: Find Existing Enrollment
    let purchase = await Purchase.findOne({ courseId, userId });

    console.log("🔍 Existing Purchase:", purchase);

    if (purchase && purchase.status === "completed") {
      console.log("⚠️ User already enrolled in this course!");
      return res.status(400).json({ message: "User already enrolled" });
    }

    if (purchase && purchase.status === "pending") {
      console.log("🔄 Updating existing pending enrollment...");
      purchase.status = "completed";
      purchase.amount = amount / 100;
      await purchase.save();
    } else {
      // ✅ Create a new enrollment
      purchase = new Purchase({
        courseId,
        userId,
        amount,
        status: "completed",
      });
      await purchase.save();
      console.log("✅ Enrollment saved successfully!");
    }

    // ✅ Step 2: Update the User Collection (Add Enrolled Course)
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );
    console.log("🛠 Updated User:", updateUser);

    // ✅ Step 3: Update the Course Collection (Add Enrolled Student)
    const updateCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: userId } },
      { new: true }
    );
    console.log("🛠 Updated Course:", updateCourse);

    res.status(200).json({ message: "Enrollment saved successfully!" });
  } catch (error) {
    console.error("❌ Error saving enrollment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
