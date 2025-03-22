import express from "express";
import mongoose from "mongoose";
import Assignment from "../models/assignmentModel.js";
import { uploadFile } from "../controllers/fileUpload.js"; // Ensure you're importing the file upload function correctly

const router = express.Router();

// router.post("/submit", uploadFile, async (req, res) => {
//   const { courseId, studentId, name, email, status } = req.body;

//   // Ensure the required fields are provided
//   if (!courseId || !studentId || !name || !email) {
//     return res.status(400).json({ error: "Missing required fields." });
//   }

//   // Get filePath from the request object (set by uploadFile)
//   const filePath = req.filePath;

//   try {
//     // Create a new assignment document
//     const newAssignment = new Assignment({
//       courseId,
//       studentId,
//       name,
//       email,
//       filePath, // Store the file path in the DB
//       status: status || "Pending", // Default to "Pending" if status is not provided
//     });

//     // Save the assignment to the database
//     await newAssignment.save();

//     // Respond with success message and the saved assignment
//     res.status(201).json({
//       message: "Assignment submitted successfully",
//       newAssignment, // Return the saved assignment data
//     });
//   } catch (error) {
//     console.error("Error saving assignment to database:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to save assignment", details: error });
//   }
// });

// Use the uploadFile middleware for file upload

// Use the uploadFile middleware for file upload
router.post("/submit", uploadFile, async (req, res) => {
  const { courseId, studentId, name, email, status } = req.body;

  console.log("Request body:", req.body); // Log the request body
  console.log("Uploaded file path:", req.filePath); // Log the file path

  // Ensure the required fields are provided
  if (!courseId || !studentId || !name || !email) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Create a new assignment document
    const newAssignment = new Assignment({
      courseId,
      studentId,
      name,
      email,
      filePath: req.filePath, // Store the file path in the DB
      status: status || "Pending", // Default to "Pending" if status is not provided
    });

    // Save the assignment to the database
    await newAssignment.save();

    // Respond with success message and the saved assignment
    res.status(201).json({
      message: "Assignment submitted successfully",
      newAssignment, // Return the saved assignment data
    });
  } catch (error) {
    console.error("Error saving assignment to database:", error);
    res
      .status(500)
      .json({ error: "Failed to save assignment", details: error.message });
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const assignments = await Assignment.find({
      courseId: req.params.courseId,
    });

    // Convert filePath to a full file URL
    const updatedAssignments = assignments.map((assignment) => ({
      ...assignment._doc,
      fileUrl: `http://localhost:5000/uploads/${assignment.filePath}`,
    }));

    res.json({ assignments: updatedAssignments });
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments" });
  }
});

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

    // Construct the full file URL
    const fileUrl = `http://localhost:5000/uploads/${assignment.filePath}`;

    // Return the assignment with the fileUrl
    res.status(200).json({ ...assignment._doc, fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update Assignment (Reviewing, Feedback, Scoring)
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
      updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
