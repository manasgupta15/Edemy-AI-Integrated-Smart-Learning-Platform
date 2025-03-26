import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog,
  likeBlog,
  uploadImage,
  incrementViews,
  getBlogsByEducator,
  updateBlog,
} from "../controllers/blogController.js";
import { extractUser } from "../middlewares/extractUser.js";
import upload from "../configs/multer.js"; // Import multer
import { protectEducator } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", extractUser, createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", extractUser, deleteBlog);
router.put("/:id/like", extractUser, likeBlog);
router.post("/upload", extractUser, upload.single("image"), uploadImage); // Image upload route
router.put("/:id/views", incrementViews); // Add the new route
// New route for fetching blogs by educator
router.get("/educator/blogs", protectEducator, getBlogsByEducator);
router.put("/:id", protectEducator, updateBlog); // Add this route

export default router;
