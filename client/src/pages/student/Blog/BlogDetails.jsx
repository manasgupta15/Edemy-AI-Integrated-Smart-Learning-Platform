import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react"; // Clerk authentication
import { AppContext } from "../../../context/AppContext";

const BlogDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [editingCommentId, setEditingCommentId] = useState(null); // State for editing comment
  const [editedCommentContent, setEditedCommentContent] = useState(""); // State for edited comment
  const { getToken } = useAuth(); // Add this line
  const { user } = useUser(); // Get current user from Clerk

  // Fetch blog and comments
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const blogRes = await axios.get(`${backendUrl}/api/blogs/${id}`);
        setBlog(blogRes.data.blog);

        const commentsRes = await axios.get(
          `${backendUrl}/api/blogs/${id}/comments`
        );
        setComments(commentsRes.data.comments);
      } catch (error) {
        console.error("Error fetching blog or comments:", error);
        setError("Failed to load blog or comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [id]);

  // Add a new comment
  // const handleAddComment = async () => {
  //   if (!user) {
  //     alert("You must be logged in to add a comment.");
  //     return;
  //   }

  //   try {
  //     const res = await axios.post(
  //       `${backendUrl}/api/blogs/${id}/comments`,
  //       { content: newComment },
  //       { withCredentials: true }
  //     );

  //     setComments([...comments, res.data.comment]); // Add new comment to the list
  //     setNewComment(""); // Clear the input field
  //   } catch (error) {
  //     console.error("Error adding comment:", error);
  //   }
  // };
  const handleAddComment = async () => {
    if (!user) {
      alert("You must be logged in to add a comment.");
      return;
    }

    try {
      const token = await getToken(); // Get Clerk token
      const res = await axios.post(
        `${backendUrl}/api/blogs/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in header
          },
        }
      );

      setComments([...comments, res.data.comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Edit a comment
  // const handleEditComment = async (commentId) => {
  //   try {
  //     const res = await axios.put(
  //       `${backendUrl}/api/comments/${commentId}`,
  //       { content: editedCommentContent },
  //       { withCredentials: true }
  //     );

  //     setComments(
  //       comments.map((comment) =>
  //         comment._id === commentId ? res.data.comment : comment
  //       )
  //     );
  //     setEditingCommentId(null); // Exit edit mode
  //   } catch (error) {
  //     console.error("Error editing comment:", error);
  //   }
  // };

  const handleEditComment = async (commentId) => {
    try {
      const token = await getToken(); // Get Clerk token
      const res = await axios.put(
        `${backendUrl}/api/comments/${commentId}`,
        { content: editedCommentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header
          },
        }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId ? res.data.comment : comment
        )
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Delete a comment
  // const handleDeleteComment = async (commentId) => {
  //   try {
  //     await axios.delete(`${backendUrl}/api/comments/${commentId}`, {
  //       withCredentials: true,
  //     });

  //     setComments(comments.filter((comment) => comment._id !== commentId)); // Remove deleted comment
  //   } catch (error) {
  //     console.error("Error deleting comment:", error);
  //   }
  // };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = await getToken(); // Get Clerk token
      await axios.delete(`${backendUrl}/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add authorization header
        },
      });

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">Loading blog...</p>
    );

  if (error)
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        {error} <br />
        <Link to="/blogs" className="text-blue-500 underline">
          Go back to blogs
        </Link>
      </p>
    );

  return (
    <div className="w-full px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 py-10">
      {/* Blog Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug text-center">
        {blog.title}
      </h1>

      {/* Author & Date */}
      <p className="text-center text-gray-600 text-md mt-2">
        By <span className="font-semibold">{blog.authorName || "Unknown"}</span>{" "}
        | {new Date(blog.createdAt).toDateString()}
      </p>

      {/* Blog Image */}
      {blog.image && (
        <div className="mt-6 flex justify-center">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full max-w-4xl max-h-[700px] rounded-lg shadow-lg object-cover"
          />
        </div>
      )}

      {/* Blog Content */}
      <div
        className="mt-8 text-gray-800 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags & Category */}
      <div className="mt-6">
        <p className="font-semibold text-gray-600">
          Category:{" "}
          <span className="text-blue-600 font-medium">
            {blog.category || "Uncategorized"}
          </span>
        </p>
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {blog.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>

        {/* Add Comment Form */}
        {user && (
          <div className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              onClick={handleAddComment}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Comment
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700">
                  {comment.authorName}
                </p>
                {user && user.id === comment.author && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingCommentId(comment._id);
                        setEditedCommentContent(comment.content);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {editingCommentId === comment._id ? (
                <div className="mt-2">
                  <textarea
                    value={editedCommentContent}
                    onChange={(e) => setEditedCommentContent(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">{comment.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-10 text-center">
        <Link
          to="/blog"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium
            hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          ← Back to Blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;
