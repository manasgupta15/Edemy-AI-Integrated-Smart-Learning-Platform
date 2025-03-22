import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // ✅ Clerk User ID remains a string
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
