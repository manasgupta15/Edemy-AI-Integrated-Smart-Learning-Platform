import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to parse raw body (Stripe requires this)
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different Stripe events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Extract metadata (user & course ID)
      const userId = session.metadata.userId;
      const courseId = session.metadata.courseId;

      // ✅ Mark course as purchased in the database
      try {
        const User = await import("../models/UserModel.js");
        await User.default.findByIdAndUpdate(userId, {
          $addToSet: { enrolledCourses: courseId },
        });
        console.log(`✅ User ${userId} enrolled in course ${courseId}`);
      } catch (err) {
        console.error("Error updating user enrollment:", err);
      }
    }

    res.json({ received: true });
  }
);

export default router;
