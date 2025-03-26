// import mongoose from "mongoose";

// const assignmentSchema = new mongoose.Schema({
//   courseId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Course",
//     required: true,
//   },
//   studentId: { type: String, required: true },
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   filePath: {
//     // Store the file path here, not the file ID
//     type: String,
//     required: true,
//   },
//   status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
//   feedback: { type: String },
//   score: { type: Number, min: 0, max: 100 },
//   submittedAt: { type: Date, default: Date.now },
//   reviewedAt: { type: Date },
// });

// export default mongoose.model("Assignment", assignmentSchema);

import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, required: true },
  fileType: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
  feedback: { type: String },
  score: { type: Number, min: 0, max: 100 },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

export default mongoose.model("Assignment", assignmentSchema);
