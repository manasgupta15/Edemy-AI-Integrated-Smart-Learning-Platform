import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * Upload image to Cloudinary
 */
export const uploadImage = async (req, res) => {
  try {
    console.log("🟢 Upload Image API called");

    if (!req.file) {
      console.error("❌ No file uploaded");
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    console.log("📂 Uploading file to Cloudinary:", req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    console.log("✅ Image uploaded successfully:", result.secure_url);
    res.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

/**
 * Create a blog post
 */
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, category, image, published } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const authorId = req.user.id; // Clerk User ID
    const authorName = req.user.fullName || "Unknown"; // Clerk Full Name

    const newBlog = new Blog({
      title,
      content,
      authorId, // Store Clerk User ID
      authorName, // Store Full Name
      tags,
      category,
      image,
      published,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

/**
 * Get all blogs (with optional filtering)
 */
export const getAllBlogs = async (req, res) => {
  try {
    console.log("🟢 Get All Blogs API called");
    const { category, limit } = req.query;

    console.log("🔍 Filtering by category:", category);
    console.log("🔢 Limit:", limit);

    const filter = category ? { category } : {};
    const blogsQuery = Blog.find(filter)
      .populate("comments")
      .sort({ createdAt: -1 }); // Sort by latest blogs

    if (limit) {
      blogsQuery.limit(parseInt(limit)); // Apply limit if provided
    }

    const blogs = await blogsQuery.exec();

    console.log(`✅ Found ${blogs.length} blogs`);
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get a single blog post
 */
export const getBlogById = async (req, res) => {
  try {
    console.log("🟢 Get Blog By ID API called");
    console.log("🔍 Searching for blog with ID:", req.params.id);

    const blog = await Blog.findById(req.params.id).populate({
      path: "comments",
      populate: { path: "author", select: "email" },
    });

    if (!blog) {
      console.error("❌ Blog not found");
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    console.log("✅ Blog found:", blog._id);
    res.json({ success: true, blog });
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Like/Unlike a blog post
 */
// export const likeBlog = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     const userId = req.user.id; // Clerk User ID
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Blog not found" });
//     }

//     const index = blog.likes.indexOf(userId);

//     if (index === -1) {
//       blog.likes.push(userId); // Add user ID to likes array
//     } else {
//       blog.likes.splice(index, 1); // Remove user ID from likes array
//     }

//     await blog.save();
//     res.json({ success: true, likes: blog.likes }); // Return updated likes array
//   } catch (error) {
//     console.error("❌ Error updating like status:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const likeBlog = async (req, res) => {
  try {
    console.log("Like request received:", {
      params: req.params,
      user: req.user,
    });

    if (!req.user) {
      console.error("Unauthorized - No user in request");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Please log in",
      });
    }

    const userId = req.user.id;
    const blogId = req.params.id;

    console.log(`User ${userId} attempting to like blog ${blogId}`);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.error("Blog not found");
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user already liked the blog
    const isLiked = blog.likes.includes(userId);

    // Update likes array
    if (isLiked) {
      blog.likes.pull(userId); // Remove like
      console.log("Like removed");
    } else {
      blog.likes.push(userId); // Add like
      console.log("Like added");
    }

    await blog.save();

    console.log(`Blog ${blogId} now has ${blog.likes.length} likes`);

    res.json({
      success: true,
      likes: blog.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error("Error in likeBlog controller:", {
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const incrementViews = async (req, res) => {
  try {
    console.log("🟢 Increment Views API called");

    const blogId = req.params.id;
    console.log("🔍 Blog ID:", blogId);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.error("❌ Blog not found");
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Increment the views count
    blog.views += 1;
    await blog.save();

    console.log("✅ Updated views:", blog.views);
    res.json({ success: true, views: blog.views });
  } catch (error) {
    console.error("❌ Error incrementing views:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete a blog post
 */
export const deleteBlog = async (req, res) => {
  try {
    console.log("🟢 Delete Blog API called");
    console.log("🔍 Blog ID:", req.params.id);
    console.log("👤 User ID:", req.user.id);

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      console.error("❌ Blog not found");
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    if (blog.authorId !== req.user.id) {
      console.error("❌ Unauthorized attempt to delete blog");
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    console.log("🗑 Deleting associated comments...");
    await Comment.deleteMany({ blog: blog._id });

    console.log("🗑 Deleting blog...");
    await blog.deleteOne();
    console.log("✅ Blog successfully deleted");

    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all blogs created by the educator
 */
export const getBlogsByEducator = async (req, res) => {
  try {
    console.log("🟢 Get Blogs By Educator API called");

    const educatorId = req.user.id; // Clerk User ID of the educator
    const blogs = await Blog.find({ authorId: educatorId }).sort({
      createdAt: -1,
    }); // Sort by latest blogs

    console.log(`✅ Found ${blogs.length} blogs by educator`);
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("❌ Error fetching blogs by educator:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update a blog post
 */
export const updateBlog = async (req, res) => {
  try {
    const { title, content, tags, category, image, published } = req.body;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Update blog fields
    blog.title = title;
    blog.content = content;
    blog.tags = tags;
    blog.category = category;
    blog.image = image;
    blog.published = published;

    await blog.save();
    res.json({ success: true, blog });
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
