// import express from "express";
// import {
//   addCourse,
//   educatorDashboardData,
//   getEducatorCourses,
//   getEnrolledStudentsData,
//   updateRoleToEducator,
// } from "../controllers/educatorController.js";
// import upload from "../configs/multer.js"; // ✅ Use Multer ONLY here
// import { protectEducator } from "../middlewares/authMiddleware.js";

// const educatorRouter = express.Router();

// // Add Educator Role
// educatorRouter.get("/update-role", updateRoleToEducator);

// // ✅ Multer only for course thumbnails (upload to Cloudinary)
// educatorRouter.post(
//   "/add-course",
//   upload.single("image"), // ✅ This ensures Multer is used only here
//   protectEducator,
//   addCourse
// );

// educatorRouter.get("/courses", protectEducator, getEducatorCourses);
// educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
// educatorRouter.get(
//   "/enrolled-students",
//   protectEducator,
//   getEnrolledStudentsData
// );

// export default educatorRouter;

import express from "express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
  getThumbnail,
} from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

educatorRouter.get("/update-role", updateRoleToEducator);
educatorRouter.post("/add-course", protectEducator, addCourse);
educatorRouter.get("/thumbnail/:id", getThumbnail);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, educatorDashboardData);
educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
