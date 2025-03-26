import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    authorId: { type: String, required: true }, // Clerk User ID
    authorName: { type: String, required: true }, // User's Full Name
    tags: { type: [String], default: [] },
    category: { type: String, required: true },
    image: { type: String },
    published: { type: Boolean, default: false },
    likes: [{ type: String }], // Store Clerk user IDs as strings
    views: { type: Number, default: 0 }, // Add views field
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
