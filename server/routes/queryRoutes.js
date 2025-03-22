import express from "express";
import Query from "../models/Query.js";
import { protectAuth, protectEducator } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ User posts a new query
router.post("/", protectAuth, async (req, res) => {
  try {
    const { reason, message } = req.body;

    if (!reason || !message) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // 🔹 Ensure `req.user` is correctly set
    console.log("User submitting query:", req.user);

    const query = new Query({
      userId: req.user.id, // Clerk `userId` is a string
      reason,
      message,
    });

    await query.save();
    res
      .status(201)
      .json({ success: true, message: "Query submitted successfully", query });
  } catch (error) {
    console.error("Error submitting query:", error);
    res.status(500).json({ success: false, message: "Error submitting query" });
  }
});

// ✅ Educator fetches all queries
router.get("/", protectEducator, async (req, res) => {
  try {
    const queries = await Query.find();
    console.log("Queries fetched from DB:", queries);
    res.json(queries);
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Error fetching queries" });
  }
});

// ✅ User fetches their own queries
router.get("/my", protectAuth, async (req, res) => {
  try {
    const queries = await Query.find({ userId: req.user.id });
    res.json(queries);
  } catch (error) {
    console.error("Error fetching user queries:", error);
    res.status(500).json({ success: false, message: "Error fetching queries" });
  }
});

// ✅ Educator responds to a query
router.put("/:id", protectEducator, async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    if (!query) {
      return res
        .status(404)
        .json({ success: false, message: "Query not found" });
    }

    query.response = req.body.response;
    query.status = "answered";
    await query.save();

    res.json({ success: true, message: "Query answered successfully", query });
  } catch (error) {
    console.error("Error responding to query:", error);
    res
      .status(500)
      .json({ success: false, message: "Error responding to query" });
  }
});

export default router;
