import mongoose from "mongoose";

const querySchema = new mongoose.Schema(
  {
    userId: {
      type: String, // 🔹 Change from ObjectId to String
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Query", querySchema);
