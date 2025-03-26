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
import { useContext, useState } from "react";
import { AppContext } from "../../../context/AppContext";

const BlogList = ({ blogs: initialBlogs }) => {
  const { backendUrl } = useContext(AppContext);
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loadingStates, setLoadingStates] = useState({});

  // Generate or get a unique client ID for this browser
  const getClientId = () => {
    let clientId = localStorage.getItem("blogClientId");
    if (!clientId) {
      clientId =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      localStorage.setItem("blogClientId", clientId);
    }
    return clientId;
  };

  const handleViewBlog = async (blogId) => {
    try {
      await axios.put(`${backendUrl}/api/blogs/${blogId}/views`, {});
      window.location.href = `/blogs/${blogId}`;
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [blogId]: true }));

      const clientId = getClientId();
      const blog = blogs.find((b) => b._id === blogId);
      const hasLiked = blog.likes.includes(clientId);

      // Optimistic UI update
      const updatedBlogs = blogs.map((blog) =>
        blog._id === blogId
          ? {
              ...blog,
              likes: hasLiked
                ? blog.likes.filter((id) => id !== clientId)
                : [...blog.likes, clientId],
            }
          : blog
      );
      setBlogs(updatedBlogs);

      // Send request to backend WITH clientId
      const res = await axios.put(`${backendUrl}/api/blogs/${blogId}/like`, {
        clientId, // Send our generated clientId
      });

      // Final update with server response
      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === blogId ? { ...blog, likes: res.data.likes } : blog
        )
      );
    } catch (error) {
      console.error("Error liking blog:", error);
      // Revert on error
      setBlogs(blogs);

      if (error.response?.status === 401) {
        console.log(
          "Make sure you removed extractUser middleware from your like route!"
        );
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, [blogId]: false }));
    }
  };

  // Check if current client liked a blog
  const hasLiked = (blog) => {
    const clientId = localStorage.getItem("blogClientId");
    return clientId && blog.likes.includes(clientId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {blogs.length > 0 ? (
          blogs.map(
            ({ _id, title, content, image, authorName, views, likes }) => {
              const isLoading = loadingStates[_id];
              const isLiked = hasLiked({ _id, likes });

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
                      disabled={isLoading}
                    >
                      Read more →
                    </button>

                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
                        <FaEye size={18} />
                        <span>{views || 0}</span>
                      </div>

                      <button
                        onClick={() => handleLike(_id)}
                        className={`flex items-center gap-2 ${
                          isLiked ? "text-pink-500" : "text-gray-400"
                        } hover:text-pink-600 transition-colors`}
                        disabled={isLoading}
                      >
                        <FaHeart size={18} />
                        <span>{likes?.length || 0}</span>
                        {isLoading && <span className="ml-1">...</span>}
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
