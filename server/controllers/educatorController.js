import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import { gfs } from "../configs/mongodb.js";
import mongoose from "mongoose";

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

// Add new Course

// export const addCourse = async (req, res) => {
//   try {
//     const { courseData } = req.body;
//     const imageFile = req.file;

//     const educatorId = req.auth.userId;

//     if (!imageFile) {
//       return res.json({ success: false, message: "Thumbnail Not Attached" });
//     }

//     const parsedCourseData = await JSON.parse(courseData);
//     parsedCourseData.educator = educatorId;
//     const newCourse = await Course.create(parsedCourseData);
//     const imageUpload = await cloudinary.uploader.upload(imageFile.path);
//     newCourse.courseThumbnail = imageUpload.secure_url;
//     await newCourse.save();

//     res.json({ success: true, message: "Course Added" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const addCourse = async (req, res) => {
//   try {
//     // Access the uploaded file
//     const image = req.file;

//     if (!image) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });
//     }

//     // Access the courseData field from req.body
//     const { courseData } = req.body;

//     if (!courseData) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Course data is required" });
//     }

//     // Parse the courseData JSON string
//     const parsedCourseData = JSON.parse(courseData);

//     // Get the educator ID from the authenticated user
//     const educatorId = req.user?.id; // Access the user ID from req.user

//     if (!educatorId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Educator ID is required" });
//     }

//     // Log the parsed data and file for debugging
//     console.log("Parsed Course Data:", parsedCourseData);
//     console.log("Uploaded Image:", image);

//     // Upload the image to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(image.path, {
//       folder: "course-thumbnails", // Optional: Organize images in a folder
//     });

//     // Process the data and save to the database
//     const newCourse = new Course({
//       ...parsedCourseData,
//       courseThumbnail: cloudinaryResponse.secure_url, // Save the Cloudinary URL
//       educator: educatorId, // Add the educator ID
//     });

//     await newCourse.save();

//     res
//       .status(201)
//       .json({ success: true, message: "Course added successfully" });
//   } catch (error) {
//     console.error("Error adding course:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// Add new Course with GridFS
export const addCourse = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    if (!req.body.courseData) {
      return res.status(400).json({
        success: false,
        message: "Course data is required",
      });
    }

    const image = req.files.image;
    const parsedCourseData = JSON.parse(req.body.courseData);
    const educatorId = req.auth.userId;

    // Create a unique filename
    const filename = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
    const uploadStream = gfs.openUploadStream(filename, {
      contentType: image.mimetype,
    });

    // Store the file ID for potential cleanup
    const fileId = uploadStream.id;

    // Write the file buffer to GridFS
    uploadStream.end(image.data);

    // Wait for the upload to complete
    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    // Get the uploaded file document
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      throw new Error("Failed to verify uploaded file");
    }

    const uploadedFile = files[0];

    // Create new course with GridFS reference
    const newCourse = new Course({
      ...parsedCourseData,
      courseThumbnail: uploadedFile._id.toString(),
      educator: educatorId,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error adding course:", error);

    // Clean up uploaded file if error occurred
    if (fileId) {
      try {
        await gfs.delete(fileId);
      } catch (cleanupError) {
        console.error("Failed to clean up thumbnail:", cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add course",
    });
  }
};

// Get thumbnail image
export const getThumbnail = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    // Check if file exists
    const files = await gfs.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Thumbnail not found",
      });
    }

    // Set proper headers
    res.set("Content-Type", files[0].contentType);
    res.set("Cache-Control", "public, max-age=31536000");

    const downloadStream = gfs.openDownloadStream(fileId);
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error retrieving thumbnail:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve thumbnail",
    });
  }
};

// Get Educator Course

export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data (Total Earnings, Enrolled students, No.of Courses)

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map((course) => course._id);

    // calculate total earnings from purchases

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // collect unique enrolled student IDs with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data with Purchase Data

export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
