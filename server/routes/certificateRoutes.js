// import express from "express";
// import { clerkClient } from "@clerk/clerk-sdk-node"; // Correct import
// import Certificate from "../models/Certificate.js"; // Import your Certificate model
// import Course from "../models/Course.js"; // Import your Course model

// const router = express.Router();

// // GET Certificate by User & Course
// router.get("/generate-certificate/:courseId", async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     const userId = req.auth.userId; // Extract user ID from Clerk's auth middleware

//     console.log("User ID:", userId); // Log the user ID
//     console.log("Course ID:", courseId); // Log the course ID

//     // Fetch user details from Clerk
//     const user = await clerkClient.users.getUser(userId);
//     if (!user) {
//       console.error("User not found in Clerk");
//       return res.status(404).json({ error: "User not found" });
//     }

//     console.log("User details:", user); // Log the user details

//     // Check if the certificate already exists
//     const existingCertificate = await Certificate.findOne({ userId, courseId });

//     if (existingCertificate) {
//       console.log("Certificate already exists:", existingCertificate);
//       return res.status(200).json({
//         success: true,
//         message: "Certificate already exists",
//         certificateUrl: existingCertificate.certificateUrl,
//       });
//     }

//     // Fetch course details
//     const course = await Course.findById(courseId);
//     if (!course) {
//       console.error("Course not found in database");
//       return res.status(404).json({ error: "Course not found" });
//     }

//     console.log("Course details:", course); // Log the course details

//     // Generate a certificate URL (replace this with your actual logic)
//     const certificateUrl = `https://your-certificate-service.com/generate?userId=${userId}&courseId=${courseId}`;

//     // Save the certificate to the database
//     const newCertificate = new Certificate({
//       userId,
//       courseId,
//       courseName: course.courseTitle, // Map courseTitle to courseName
//       userName: `${user.firstName} ${user.lastName}`, // Use Clerk's user details
//       certificateUrl,
//     });

//     await newCertificate.save();

//     console.log("Certificate saved successfully:", newCertificate);

//     res.status(200).json({
//       success: true,
//       message: "Certificate generated successfully",
//       certificateUrl,
//     });
//   } catch (error) {
//     console.error("Error in certificate generation:", error); // Log the error
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import {
  generateCertificate,
  saveCertificate,
} from "../certificateGenerator.js"; // Import the certificate generation logic

const router = express.Router();

// GET Certificate by User & Course
router.get("/generate-certificate/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth.userId; // Extract user ID from Clerk's auth middleware

    console.log("User ID:", userId); // Log the user ID
    console.log("Course ID:", courseId); // Log the course ID

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      console.error("User not found in Clerk");
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User details:", user); // Log the user details

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      console.error("Course not found in database");
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("Course details:", course); // Log the course details

    // Generate the certificate PDF
    const pdfBytes = await generateCertificate(
      `${user.firstName} ${user.lastName}`,
      course.courseTitle
    );

    // Save the certificate file
    const filePath = await saveCertificate(pdfBytes, userId, courseId);

    // Create a URL for the certificate
    const certificateUrl = `${req.protocol}://${req.get(
      "host"
    )}/certificates/${userId}_${courseId}.pdf`;

    // Save the certificate to the database
    const newCertificate = new Certificate({
      userId,
      courseId,
      courseName: course.courseTitle,
      userName: `${user.firstName} ${user.lastName}`,
      certificateUrl,
    });

    await newCertificate.save();

    console.log("Certificate saved successfully:", newCertificate);

    res.status(200).json({
      success: true,
      message: "Certificate generated successfully",
      certificateUrl,
    });
  } catch (error) {
    console.error("Error in certificate generation:", error); // Log the error
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
