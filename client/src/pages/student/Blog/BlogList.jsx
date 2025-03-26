// import { Link } from "react-router-dom";
// import { FaHeart, FaEye } from "react-icons/fa"; // Import FaHeart and FaEye
// import axios from "axios";
// import { useUser } from "@clerk/clerk-react"; // Clerk authentication
// import { useContext, useState } from "react";
// import { AppContext } from "../../../context/AppContext";

// const BlogList = ({ blogs: initialBlogs }) => {
//   const { backendUrl } = useContext(AppContext);
//   const { user } = useUser(); // Get current user from Clerk
//   const [blogs, setBlogs] = useState(initialBlogs); // Local state for blogs

//   const handleViewBlog = async (blogId) => {
//     try {
//       // Call the incrementViews API
//       await axios.put(
//         `${backendUrl}/api/blogs/${blogId}/views`,
//         {},
//         {
//           withCredentials: true, // Send cookies (Clerk session)
//         }
//       );

//       // Navigate to the blog page
//       window.location.href = `/blogs/${blogId}`;
//     } catch (error) {
//       console.error("Error incrementing views:", error);
//     }
//   };

//   const handleLike = async (blogId) => {
//     if (!user) {
//       alert("You must be logged in to like a blog.");
//       return;
//     }

//     try {
//       // Find the blog being liked
//       const blog = blogs.find((blog) => blog._id === blogId);
//       const isLiked = blog.likes.includes(user.id);

//       // Optimistically update the UI
//       const updatedBlogs = blogs.map((blog) =>
//         blog._id === blogId
//           ? {
//               ...blog,
//               likes: isLiked
//                 ? blog.likes.filter((id) => id !== user.id) // Remove like
//                 : [...blog.likes, user.id], // Add like
//             }
//           : blog
//       );
//       setBlogs(updatedBlogs);

//       // Send the request to the backend
//       const res = await axios.put(
//         `${backendUrl}/api/blogs/${blogId}/like`,
//         {},
//         {
//           withCredentials: true, // Send cookies (Clerk session)
//         }
//       );

//       // Update the state with the response from the backend (optional, for consistency)
//       setBlogs((prevBlogs) =>
//         prevBlogs.map((blog) =>
//           blog._id === blogId ? { ...blog, likes: res.data.likes } : blog
//         )
//       );
//     } catch (error) {
//       console.error("Error liking blog:", error);

//       // Revert the UI if the request fails
//       setBlogs(initialBlogs);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//         {blogs.length > 0 ? (
//           blogs.map(
//             ({ _id, title, content, image, authorName, views, likes }) => {
//               const isLiked = user && likes.includes(user.id); // Check if the user liked the blog
//               return (
//                 <div
//                   key={_id}
//                   className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
//                 >
//                   <img
//                     src={image || "https://via.placeholder.com/400"}
//                     alt={title}
//                     className="w-full h-60 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="text-xl font-semibold">{title}</h3>
//                     {/* Render HTML content using dangerouslySetInnerHTML */}
//                     <div
//                       className="text-gray-600 mt-2"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           content?.slice(0, 100) + "..." ||
//                           "No content available",
//                       }}
//                     />
//                     <p className="text-sm text-gray-500 mt-1">
//                       Author: {authorName || "Unknown"}
//                     </p>
//                     {/* Updated Link to Blog Details Page */}
//                     <button
//                       onClick={() => handleViewBlog(_id)} // Call handleViewBlog
//                       className="text-blue-500 font-medium mt-3 block hover:underline"
//                     >
//                       Read more →
//                     </button>

//                     {/* View and Like Counts */}
//                     <div className="flex items-center gap-4 mt-3">
//                       {/* View Count */}
//                       <div
//                         className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
//                         title="Total Views"
//                       >
//                         <FaEye size={18} />
//                         <span>{views || 0}</span>
//                       </div>

//                       {/* Like Count */}
//                       <button
//                         onClick={() => handleLike(_id)}
//                         className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
//                         title="Total Likes"
//                       >
//                         <FaHeart
//                           size={18}
//                           className={
//                             isLiked ? "text-pink-500" : "text-gray-400"
//                           }
//                         />
//                         <span>{likes?.length || 0}</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             }
//           )
//         ) : (
//           <p className="text-center text-gray-500 col-span-3">
//             No blogs available.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogList;

import { Link } from "react-router-dom";
import { FaHeart, FaEye } from "react-icons/fa";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";

const BlogList = ({ blogs: initialBlogs }) => {
  const { backendUrl } = useContext(AppContext);
  const { user } = useUser();
  const { getToken } = useAuth();
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleViewBlog = async (blogId) => {
    try {
      await axios.put(
        `${backendUrl}/api/blogs/${blogId}/views`,
        {},
        {
          withCredentials: true,
        }
      );
      window.location.href = `/blogs/${blogId}`;
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleLike = async (blogId) => {
    if (!user) {
      alert("You must be logged in to like a blog.");
      return;
    }

    try {
      console.log("Attempting to like blog:", blogId);

      // Optimistic UI update
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
                ...blog,
                likes: blog.likes.includes(user.id)
                  ? blog.likes.filter((id) => id !== user.id)
                  : [...blog.likes, user.id],
              }
            : blog
        )
      );

      const token = await getToken();
      console.log("Auth token retrieved");

      const res = await axios.put(
        `${backendUrl}/api/blogs/${blogId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Like response:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Like action failed");
      }
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });

      // Revert optimistic update on error
      setBlogs(initialBlogs);
      alert(
        error.response?.data?.message ||
          "Failed to update like. Please try again."
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {blogs.length > 0 ? (
          blogs.map(
            ({ _id, title, content, image, authorName, views, likes }) => {
              const isLiked = user && likes.includes(user.id);
              return (
                <div
                  key={_id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={image || "https://via.placeholder.com/400"}
                    alt={title}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{title}</h3>
                    <div
                      className="text-gray-600 mt-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          content?.slice(0, 100) + "..." ||
                          "No content available",
                      }}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Author: {authorName || "Unknown"}
                    </p>
                    <button
                      onClick={() => handleViewBlog(_id)}
                      className="text-blue-500 font-medium mt-3 block hover:underline"
                    >
                      Read more →
                    </button>

                    <div className="flex items-center gap-4 mt-3">
                      <div
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Total Views"
                      >
                        <FaEye size={18} />
                        <span>{views || 0}</span>
                      </div>

                      <button
                        onClick={() => handleLike(_id)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Total Likes"
                      >
                        <FaHeart
                          size={18}
                          className={
                            isLiked ? "text-pink-500" : "text-gray-400"
                          }
                        />
                        <span>{likes?.length || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            No blogs available.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
