import express from "express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import Certificate from "../models/Certificate.js";
import Course from "../models/Course.js";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { generateCertificate } from "../certificateGenerator.js";

const router = express.Router();

// Generate Certificate
router.get("/generate-certificate/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth.userId;

    // Verify user exists
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Generate PDF
    const pdfBytes = await generateCertificate(
      `${user.firstName} ${user.lastName}`,
      course.courseTitle
    );

    // Save to GridFS
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: "certificates" });

    const filename = `certificate_${userId}_${courseId}.pdf`;
    const uploadStream = bucket.openUploadStream(filename);
    uploadStream.end(pdfBytes);

    uploadStream.on("finish", async () => {
      // Create certificate record
      const certificateUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/certificates/download/${filename}`;

      const newCertificate = new Certificate({
        userId,
        courseId,
        courseName: course.courseTitle,
        userName: `${user.firstName} ${user.lastName}`,
        certificateUrl,
      });

      await newCertificate.save();

      res.status(200).json({
        success: true,
        message: "Certificate generated successfully",
        certificateUrl,
      });
    });

    uploadStream.on("error", (error) => {
      throw error;
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    res.status(500).json({
      error: "Failed to generate certificate",
      details: error.message,
    });
  }
});

// Download Certificate
// In certificateRoutes.js
router.get("/download/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const conn = mongoose.connection;
    const bucket = new GridFSBucket(conn.db, { bucketName: "certificates" });

    const files = await bucket.find({ filename }).toArray();
    if (!files.length) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // For Vercel - download as buffer first
    const downloadStream = bucket.openDownloadStreamByName(filename);
    const chunks = [];

    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.send(buffer);
    });

    downloadStream.on("error", () => {
      res.status(404).json({ error: "Certificate not found" });
    });
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({
      error: "Failed to download certificate",
      details: error.message,
    });
  }
});

router.get("/check-certificate/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.auth.userId;

    const certificate = await Certificate.findOne({ userId, courseId });

    if (certificate) {
      return res.status(200).json({
        success: true,
        certificateUrl: certificate.certificateUrl,
      });
    }

    res.status(200).json({ success: false });
  } catch (error) {
    console.error("Error checking certificate:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
