// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import { FaHeart, FaEye } from "react-icons/fa"; // Import FaEye
// import { useUser } from "@clerk/clerk-react"; // Clerk authentication
// import { AppContext } from "../../context/AppContext";

// const BlogSection = () => {
//   const { backendUrl } = useContext(AppContext);
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser(); // Get current user from Clerk

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/blogs?limit=3`);
//         setBlogs(res.data.blogs || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//         setError("Failed to load blogs.");
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleLike = async (blogId) => {
//     if (!user) {
//       alert("You must be logged in to like a blog.");
//       return;
//     }

//     try {
//       const res = await axios.put(
//         `${backendUrl}/api/blogs/${blogId}/like`,
//         {},
//         {
//           withCredentials: true, // Send cookies (Clerk session)
//         }
//       );

//       // Update the blogs state with the new likes count
//       setBlogs((prevBlogs) =>
//         prevBlogs.map((blog) =>
//           blog._id === blogId ? { ...blog, likes: res.data.likes } : blog
//         )
//       );
//     } catch (error) {
//       console.error("Error liking blog:", error);
//     }
//   };

//   const handleViewBlog = async (blogId) => {
//     try {
//       // Call the incrementViews API
//       await axios.put(
//         `${backendUrl}/api/blogs/${blogId}/views`,
//         {},
//         {
//           withCredentials: true,
//         }
//       );

//       // Navigate to the blog page
//       window.location.href = `/blogs/${blogId}`;
//     } catch (error) {
//       console.error("Error incrementing views:", error);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading blogs...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

//   return (
//     <div className="pb-14 px-8 md:px-0">
//       <h2 className="text-3xl font-medium text-gray-800 text-center">
//         Latest Blogs
//       </h2>
//       <p className="md:text-base text-gray-500 mt-3 text-center">
//         Explore insights, tips, and trends from our expert educators.
//       </p>
//       <div className="flex justify-center">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl">
//           {blogs.length > 0 ? (
//             blogs.map((blog) => {
//               const isLiked = user && blog.likes.includes(user.id); // Check if the user liked the blog
//               return (
//                 <div
//                   key={blog._id}
//                   className="relative border border-gray-500/30 rounded-lg bg-white shadow-md overflow-hidden"
//                 >
//                   <img
//                     src={blog.image || "https://via.placeholder.com/400"}
//                     alt={blog.title}
//                     className="w-full h-60 object-cover"
//                   />
//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-gray-800">
//                       {blog.title}
//                     </h3>
//                     <div
//                       className="text-gray-500 text-sm mt-2"
//                       dangerouslySetInnerHTML={{
//                         __html:
//                           blog.content?.slice(0, 100) + "..." ||
//                           "No content available",
//                       }}
//                     />
//                     <button
//                       onClick={() => handleViewBlog(blog._id)}
//                       className="text-blue-500 underline mt-3 cursor-pointer"
//                     >
//                       Read more
//                     </button>
//                   </div>

//                   {/* Like Button */}
//                   <button
//                     onClick={() => handleLike(blog._id)}
//                     className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md"
//                   >
//                     <FaHeart
//                       size={24}
//                       className={isLiked ? "text-pink-500" : "text-gray-400"}
//                     />
//                   </button>

//                   {/* Like Count */}
//                   <p className="absolute bottom-3 right-10 text-gray-600">
//                     {blog.likes.length}
//                   </p>

//                   {/* View Count */}
//                   <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white p-2 rounded-full shadow-md">
//                     <FaEye size={20} className="text-gray-600" />
//                     <p className="text-gray-600">{blog.views}</p>
//                   </div>
//                 </div>
//               );
//             })
//           ) : (
//             <p className="text-gray-500 text-center col-span-3">
//               No blogs available.
//             </p>
//           )}
//         </div>
//       </div>
//       <div className="mt-6 text-center">
//         <Link
//           to="/blog"
//           className="bg-blue-600 text-white px-6 py-2 rounded-md"
//         >
//           View More Blogs
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default BlogSection;

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaEye } from "react-icons/fa";
import { useUser, useAuth } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const BlogSection = () => {
  const { backendUrl } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth(); // Add useAuth for token access

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/blogs?limit=3`);
        setBlogs(res.data.blogs || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl]);

  const handleLike = async (blogId) => {
    if (!user) {
      alert("You must be logged in to like a blog.");
      return;
    }

    try {
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

      const token = await getToken(); // Get the auth token

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

      if (!res.data.success) {
        throw new Error(res.data.message || "Like action failed");
      }
    } catch (error) {
      console.error("Error liking blog:", error);
      // Revert optimistic update on error
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
      alert(
        error.response?.data?.message ||
          "Failed to update like. Please try again."
      );
    }
  };

  const handleViewBlog = async (blogId) => {
    try {
      await axios.put(
        `${backendUrl}/api/blogs/${blogId}/views`,
        {},
        { withCredentials: true }
      );
      window.location.href = `/blogs/${blogId}`;
    } catch (error) {
      console.error("Error incrementing views:", error);
      // Still allow navigation even if view count fails
      window.location.href = `/blogs/${blogId}`;
    }
  };

  if (loading) return <div className="text-center mt-10">Loading blogs...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <section className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-medium text-gray-800 text-center">
        Latest Blogs
      </h2>
      <p className="md:text-base text-gray-500 mt-3 text-center">
        Explore insights, tips, and trends from our expert educators.
      </p>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-6xl">
          {blogs.length > 0 ? (
            blogs.map((blog) => {
              const isLiked = user && blog.likes.includes(user.id);
              return (
                <article
                  key={blog._id}
                  className="relative border border-gray-500/30 rounded-lg bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={blog.image || "https://via.placeholder.com/400"}
                    alt={blog.title}
                    className="w-full h-60 object-cover"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div
                      className="text-gray-500 text-sm mt-2 line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.content?.slice(0, 100) + "..." ||
                          "No content available",
                      }}
                    />
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="text-blue-500 hover:text-blue-700 underline mt-3 cursor-pointer"
                    >
                      Read more
                    </button>
                  </div>

                  {/* Like Button and Count */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="text-gray-600">{blog.likes.length}</span>
                    <button
                      onClick={() => handleLike(blog._id)}
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      aria-label={
                        isLiked ? "Unlike this blog" : "Like this blog"
                      }
                    >
                      <FaHeart
                        size={20}
                        className={isLiked ? "text-pink-500" : "text-gray-400"}
                      />
                    </button>
                  </div>

                  {/* View Count */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-white p-2 rounded-full shadow-md">
                    <FaEye size={16} className="text-gray-600" />
                    <span className="text-gray-600">{blog.views || 0}</span>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="text-gray-500 text-center col-span-3">
              No blogs available at the moment.
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/blog"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
        >
          View All Blogs
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
