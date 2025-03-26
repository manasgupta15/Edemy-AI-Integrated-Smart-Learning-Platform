import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

/**
 * Fetch all comments for a blog post
 */
export const fetchComments = async (req, res) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId }).sort({
      createdAt: -1,
    }); // Sort by latest comments
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Add a comment to a blog post
 */
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.blogId);

    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });

    const comment = new Comment({
      content,
      blog: blog._id,
      author: req.user.id, // Clerk User ID
      authorName: req.user.fullName, // Clerk User's Full Name
    });
    await comment.save();

    blog.comments.push(comment._id);
    await blog.save();

    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Edit a comment (only the author can edit)
 */
export const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    comment.content = content;
    await comment.save();

    res.json({ success: true, message: "Comment updated", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a comment (only the author can delete)
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
