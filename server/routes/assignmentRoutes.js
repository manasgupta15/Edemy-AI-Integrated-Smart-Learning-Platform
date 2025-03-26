// import express from "express";
// import mongoose from "mongoose";
// import Assignment from "../models/assignmentModel.js";
// // import { uploadFile } from "../controllers/fileUpload.js"; // Ensure you're importing the file upload function correctly

// const router = express.Router();

// // Get GridFS bucket
// const getBucket = () => {
//   const conn = mongoose.connection;
//   return new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: "assignments",
//   });
// };

// router.post("/submit", async (req, res) => {
//   try {
//     const { courseId, studentId, name, email, status } = req.body;
//     const file = req.files?.file;

//     if (!courseId || !studentId || !name || !email || !file) {
//       return res.status(400).json({
//         error: "Missing required fields",
//         details: {
//           courseId: !!courseId,
//           studentId: !!studentId,
//           name: !!name,
//           email: !!email,
//           file: !!file,
//         },
//       });
//     }

//     const bucket = getBucket();
//     const uploadStream = bucket.openUploadStream(file.name, {
//       metadata: {
//         courseId,
//         studentId,
//         originalName: file.name,
//         contentType: file.mimetype,
//       },
//     });

//     uploadStream.end(file.data);

//     uploadStream.on("finish", async () => {
//       const newAssignment = new Assignment({
//         courseId,
//         studentId,
//         name,
//         email,
//         fileId: uploadStream.id,
//         fileName: file.name,
//         fileSize: file.size,
//         fileType: file.mimetype,
//         status: status || "Pending",
//       });

//       await newAssignment.save();
//       res.status(201).json({
//         message: "Assignment submitted successfully",
//         assignment: newAssignment,
//       });
//     });

//     uploadStream.on("error", (error) => {
//       throw error;
//     });
//   } catch (error) {
//     console.error("Submission error:", error);
//     res.status(500).json({
//       error: "Failed to submit assignment",
//       details:
//         process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// });

// router.get("/:courseId", async (req, res) => {
//   try {
//     const assignments = await Assignment.find({
//       courseId: req.params.courseId,
//     });

//     // Convert filePath to a full file URL
//     const updatedAssignments = assignments.map((assignment) => ({
//       ...assignment._doc,
//       fileUrl: `http://localhost:5000/uploads/${assignment.filePath}`,
//     }));

//     res.json({ assignments: updatedAssignments });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching assignments" });
//   }
// });

// router.get("/single/:assignmentId", async (req, res) => {
//   try {
//     const { assignmentId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
//       return res.status(400).json({ error: "Invalid assignmentId format." });
//     }

//     const assignment = await Assignment.findById(assignmentId).populate(
//       "courseId",
//       "courseTitle"
//     );

//     if (!assignment) {
//       return res.status(404).json({ error: "Assignment not found." });
//     }

//     // Construct the full file URL
//     const fileUrl = `http://localhost:5000/uploads/${assignment.filePath}`;

//     // Return the assignment with the fileUrl
//     res.status(200).json({ ...assignment._doc, fileUrl });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // ✅ Update Assignment (Reviewing, Feedback, Scoring)
// router.put("/review/:assignmentId", async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     const { status, feedback, score } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
//       return res.status(400).json({ error: "Invalid assignmentId format." });
//     }

//     // Validate status value
//     if (status && !["Pending", "Reviewed"].includes(status)) {
//       return res.status(400).json({ error: "Invalid status value." });
//     }

//     // Validate score range
//     if (score !== undefined && (score < 0 || score > 100)) {
//       return res
//         .status(400)
//         .json({ error: "Score must be between 0 and 100." });
//     }

//     // Update assignment
//     const updatedAssignment = await Assignment.findByIdAndUpdate(
//       assignmentId,
//       { status, feedback, score, reviewedAt: new Date() },
//       { new: true }
//     );

//     if (!updatedAssignment) {
//       return res.status(404).json({ error: "Assignment not found." });
//     }

//     res.status(200).json({
//       message: "Assignment reviewed successfully",
//       updatedAssignment,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default router;

import express from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignmentModel.js";

const router = express.Router();

// Get GridFS bucket
const getBucket = () => {
  const conn = mongoose.connection;
  return new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "assignments",
  });
};

// Submit Assignment
router.post("/submit", async (req, res) => {
  try {
    const { courseId, studentId, name, email, status } = req.body;
    const file = req.files?.file;

    if (!courseId || !studentId || !name || !email || !file) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          courseId: !!courseId,
          studentId: !!studentId,
          name: !!name,
          email: !!email,
          file: !!file,
        },
      });
    }

    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        courseId,
        studentId,
        originalName: file.name,
        contentType: file.mimetype,
      },
    });

    uploadStream.end(file.data);

    uploadStream.on("finish", async () => {
      const newAssignment = new Assignment({
        courseId,
        studentId,
        name,
        email,
        fileId: uploadStream.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.mimetype,
        status: status || "Pending",
      });

      await newAssignment.save();
      res.status(201).json({
        message: "Assignment submitted successfully",
        assignment: {
          ...newAssignment.toObject(),
          fileUrl: `http://localhost:5000/api/assignments/file/${uploadStream.id}`,
        },
      });
    });

    uploadStream.on("error", (error) => {
      throw error;
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({
      error: "Failed to submit assignment",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get all assignments for a course
router.get("/:courseId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      courseId: req.params.courseId,
    });

    // Add file URLs to each assignment
    const assignmentsWithUrls = assignments.map((assignment) => ({
      ...assignment.toObject(),
      fileUrl: `http://localhost:5000/api/assignments/file/${assignment.fileId}`,
    }));

    res.json({ assignments: assignmentsWithUrls });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
});

// Get single assignment
router.get("/single/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ error: "Invalid assignmentId format." });
    }

    const assignment = await Assignment.findById(assignmentId).populate(
      "courseId",
      "courseTitle"
    );

    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    res.status(200).json({
      ...assignment.toObject(),
      fileUrl: `http://localhost:5000/api/assignments/file/${assignment.fileId}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download assignment file
router.get("/file/:fileId", async (req, res) => {
  try {
    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Check if file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set(
      "Content-Disposition",
      `attachment; filename="${files[0].filename}"`
    );

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
});

// Update Assignment (Reviewing, Feedback, Scoring)
router.put("/review/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { status, feedback, score } = req.body;

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
      return res.status(400).json({ error: "Invalid assignmentId format." });
    }

    // Validate status value
    if (status && !["Pending", "Reviewed"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    // Validate score range
    if (score !== undefined && (score < 0 || score > 100)) {
      return res
        .status(400)
        .json({ error: "Score must be between 0 and 100." });
    }

    // Update assignment
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { status, feedback, score, reviewedAt: new Date() },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    res.status(200).json({
      message: "Assignment reviewed successfully",
      updatedAssignment: {
        ...updatedAssignment.toObject(),
        fileUrl: `http://localhost:5000/api/assignments/file/${updatedAssignment.fileId}`,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File exists check
router.get("/file/:fileId/exists", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
      return res.json({ exists: false });
    }

    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await bucket.find({ _id: fileId }).next();

    res.json({ exists: !!file });
  } catch (error) {
    res.json({ exists: false });
  }
});

// File download endpoint
router.get("/file/:fileId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.fileId)) {
      return res.status(400).json({ error: "Invalid file ID" });
    }

    const bucket = getBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const file = await bucket.find({ _id: fileId }).next();

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set({
      "Content-Type": file.contentType || "application/pdf",
      "Content-Disposition": `inline; filename="${file.filename}"`,
    });

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Failed to download file" });
  }
});
export default router;
