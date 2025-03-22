import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  questionType: {
    type: String,
    enum: ["MCQ", "TrueFalse", "FillBlank"],
    required: true,
  },
});

const quizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    educatorId: {
      type: String, // ✅ Changed from ObjectId to String (for Clerk user ID)
      required: true,
    },
    title: { type: String, required: true },
    questions: {
      type: [questionSchema],
      validate: [
        (questions) => questions.length > 0,
        "Quiz must have at least one question",
      ],
    },
    duration: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
