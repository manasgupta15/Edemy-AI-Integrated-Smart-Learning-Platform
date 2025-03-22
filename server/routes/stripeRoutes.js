import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { protectAuth } from "../middlewares/authMiddleware.js";
import { clerkClient } from "@clerk/express";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", protectAuth, async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Fetch user email from Clerk
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;

    const amount = (
      course.coursePrice -
      (course.discount * course.coursePrice) / 100
    ).toFixed(2);

    // Create purchase record
    const purchase = await Purchase.create({
      courseId: course._id,
      userId,
      amount,
      status: "pending",
    });

    // Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: process.env.CURRENCY.toLowerCase(),
            product_data: { name: course.courseTitle },
            unit_amount: Math.floor(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { purchaseId: purchase._id.toString(), userId },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Webhook to update payment status
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res
        .status(400)
        .json({ success: false, message: `Webhook error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const purchaseId = session.metadata.purchaseId;

      await Purchase.findByIdAndUpdate(purchaseId, { status: "completed" });
    }

    res.json({ success: true });
  }
);

export default router;
