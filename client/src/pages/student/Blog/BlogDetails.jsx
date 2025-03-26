// import { useContext, useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react"; // Clerk authentication
// import { AppContext } from "../../../context/AppContext";

// const BlogDetails = () => {
//   const { backendUrl } = useContext(AppContext);
//   const { id } = useParams();
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [comments, setComments] = useState([]); // State for comments
//   const [newComment, setNewComment] = useState(""); // State for new comment input
//   const [editingCommentId, setEditingCommentId] = useState(null); // State for editing comment
//   const [editedCommentContent, setEditedCommentContent] = useState(""); // State for edited comment
//   const { user } = useUser(); // Get current user from Clerk

//   // Fetch blog and comments
//   useEffect(() => {
//     const fetchBlogAndComments = async () => {
//       try {
//         const blogRes = await axios.get(`${backendUrl}/api/blogs/${id}`);
//         setBlog(blogRes.data.blog);

//         const commentsRes = await axios.get(
//           `${backendUrl}/api/blogs/${id}/comments`
//         );
//         setComments(commentsRes.data.comments);
//       } catch (error) {
//         console.error("Error fetching blog or comments:", error);
//         setError("Failed to load blog or comments.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogAndComments();
//   }, [id]);

//   // Add a new comment
//   const handleAddComment = async () => {
//     if (!user) {
//       alert("You must be logged in to add a comment.");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/blogs/${id}/comments`,
//         { content: newComment },
//         { withCredentials: true }
//       );

//       setComments([...comments, res.data.comment]); // Add new comment to the list
//       setNewComment(""); // Clear the input field
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   // Edit a comment
//   const handleEditComment = async (commentId) => {
//     try {
//       const res = await axios.put(
//         `${backendUrl}/api/comments/${commentId}`,
//         { content: editedCommentContent },
//         { withCredentials: true }
//       );

//       setComments(
//         comments.map((comment) =>
//           comment._id === commentId ? res.data.comment : comment
//         )
//       );
//       setEditingCommentId(null); // Exit edit mode
//     } catch (error) {
//       console.error("Error editing comment:", error);
//     }
//   };

//   // Delete a comment
//   const handleDeleteComment = async (commentId) => {
//     try {
//       await axios.delete(`${backendUrl}/api/comments/${commentId}`, {
//         withCredentials: true,
//       });

//       setComments(comments.filter((comment) => comment._id !== commentId)); // Remove deleted comment
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//     }
//   };

//   if (loading)
//     return (
//       <p className="text-center mt-10 text-gray-600 text-lg">Loading blog...</p>
//     );

//   if (error)
//     return (
//       <p className="text-center mt-10 text-red-500 text-lg">
//         {error} <br />
//         <Link to="/blogs" className="text-blue-500 underline">
//           Go back to blogs
//         </Link>
//       </p>
//     );

//   return (
//     <div className="w-full px-6 sm:px-12 md:px-20 lg:px-32 xl:px-48 py-10">
//       {/* Blog Title */}
//       <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-snug text-center">
//         {blog.title}
//       </h1>

//       {/* Author & Date */}
//       <p className="text-center text-gray-600 text-md mt-2">
//         By <span className="font-semibold">{blog.authorName || "Unknown"}</span>{" "}
//         | {new Date(blog.createdAt).toDateString()}
//       </p>

//       {/* Blog Image */}
//       {blog.image && (
//         <div className="mt-6 flex justify-center">
//           <img
//             src={blog.image}
//             alt={blog.title}
//             className="w-full max-w-4xl max-h-[700px] rounded-lg shadow-lg object-cover"
//           />
//         </div>
//       )}

//       {/* Blog Content */}
//       <div
//         className="mt-8 text-gray-800 leading-relaxed text-lg"
//         dangerouslySetInnerHTML={{ __html: blog.content }}
//       />

//       {/* Tags & Category */}
//       <div className="mt-6">
//         <p className="font-semibold text-gray-600">
//           Category:{" "}
//           <span className="text-blue-600 font-medium">
//             {blog.category || "Uncategorized"}
//           </span>
//         </p>
//         {blog.tags && blog.tags.length > 0 && (
//           <div className="mt-3 flex flex-wrap gap-3">
//             {blog.tags.map((tag, index) => (
//               <span
//                 key={index}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full font-medium"
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Comment Section */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>

//         {/* Add Comment Form */}
//         {user && (
//           <div className="mb-6">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows="3"
//             />
//             <button
//               onClick={handleAddComment}
//               className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Add Comment
//             </button>
//           </div>
//         )}

//         {/* Comments List */}
//         <div className="space-y-4">
//           {comments.map((comment) => (
//             <div
//               key={comment._id}
//               className="p-4 border border-gray-200 rounded-lg"
//             >
//               <div className="flex justify-between items-center">
//                 <p className="font-semibold text-gray-700">
//                   {comment.authorName}
//                 </p>
//                 {user && user.id === comment.author && (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setEditingCommentId(comment._id);
//                         setEditedCommentContent(comment.content);
//                       }}
//                       className="text-blue-500 hover:text-blue-700"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDeleteComment(comment._id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>
//               {editingCommentId === comment._id ? (
//                 <div className="mt-2">
//                   <textarea
//                     value={editedCommentContent}
//                     onChange={(e) => setEditedCommentContent(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     rows="2"
//                   />
//                   <button
//                     onClick={() => handleEditComment(comment._id)}
//                     className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
//                   >
//                     Save
//                   </button>
//                 </div>
//               ) : (
//                 <p className="mt-2 text-gray-600">{comment.content}</p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Back Button */}
//       <div className="mt-10 text-center">
//         <Link
//           to="/blog"
//           className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-medium
//             hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
//         >
//           ← Back to Blogs
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;

import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AppContext } from "../../../context/AppContext";

const BlogDetails = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const { user } = useUser();
  const { getToken } = useAuth(); // Add useAuth for token access

  // Fetch blog and comments
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const [blogRes, commentsRes] = await Promise.all([
          axios.get(`${backendUrl}/api/blogs/${id}`),
          axios.get(`${backendUrl}/api/blogs/${id}/comments`),
        ]);

        setBlog(blogRes.data.blog);
        setComments(commentsRes.data.comments || []);
      } catch (error) {
        console.error("Error fetching blog or comments:", error);
        setError("Failed to load blog or comments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndComments();
  }, [id, backendUrl]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!user) {
      alert("You must be logged in to add a comment.");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const token = await getToken();

      const res = await axios.post(
        `${backendUrl}/api/blogs/${id}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setComments([res.data.comment, ...comments]); // Add new comment at the beginning
      setNewComment(""); // Clear the input field
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to add comment. Please try again."
      );
    }
  };

  // Edit a comment
  const handleEditComment = async (commentId) => {
    if (!editedCommentContent.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const token = await getToken();

      const res = await axios.put(
        `${backendUrl}/api/comments/${commentId}`,
        { content: editedCommentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId ? res.data.comment : comment
        )
      );
      setEditingCommentId(null);
      setEditedCommentContent("");
    } catch (error) {
      console.error("Error editing comment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to edit comment. Please try again."
      );
    }
  };

  // Delete a comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = await getToken();

      await axios.delete(`${backendUrl}/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete comment. Please try again."
      );
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-gray-600">Loading blog...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 text-lg">{error}</p>
        <Link
          to="/blogs"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back to blogs
        </Link>
      </div>
    );

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 max-w-7xl mx-auto">
      {/* Blog Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-gray-600">
          <span>
            By <strong>{blog.authorName || "Unknown"}</strong>
          </span>
          <span className="hidden sm:block">•</span>
          <span>
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Blog Image */}
      {blog.image && (
        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-auto max-h-[70vh] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Blog Content */}
      <article
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags & Category */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {blog.category || "Uncategorized"}
          </span>
          {blog.tags?.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comment Section */}
      <section className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Add a comment</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              rows="4"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        ) : (
          <div className="mb-8 text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                Sign in
              </Link>{" "}
              to leave a comment
            </p>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="border-b border-gray-200 pb-6 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {comment.authorName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  {user?.id === comment.author && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditedCommentContent(comment.content);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingCommentId === comment._id ? (
                  <div className="mt-3">
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      rows="3"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        disabled={!editedCommentContent.trim()}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditedCommentContent("");
                        }}
                        className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700 whitespace-pre-line">
                    {comment.content}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Back Button */}
      <div className="mt-12 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow hover:shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to All Blogs
        </Link>
      </div>
    </div>
  );
};

export default BlogDetails;
