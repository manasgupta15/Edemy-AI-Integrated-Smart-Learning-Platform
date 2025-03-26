import express from "express";
import { extractUser } from "../middlewares/extractUser.js";
import {
  fetchComments,
  addComment,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// Fetch all comments for a blog
router.get("/blogs/:blogId/comments", fetchComments);

// Add a comment to a blog
router.post("/blogs/:blogId/comments", extractUser, addComment);

// Edit a comment
router.put("/comments/:commentId", extractUser, editComment);

// Delete a comment
router.delete("/comments/:commentId", extractUser, deleteComment);

export default router;
