import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk user ID
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  courseName: { type: String, required: true }, // Ensure this matches the Course model's field
  userName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  certificateUrl: { type: String, required: true },
});

export default mongoose.model("Certificate", CertificateSchema);
