// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";

// const EducatorBlogs = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useUser();

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:5000/api/blogs/educator/blogs",
//           {
//             withCredentials: true,
//           }
//         );
//         setBlogs(res.data.blogs);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//         setError("Failed to load blogs.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   const handleDeleteBlog = async (blogId) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
//         withCredentials: true,
//       });
//       setBlogs(blogs.filter((blog) => blog._id !== blogId)); // Remove deleted blog from the list
//     } catch (error) {
//       console.error("Error deleting blog:", error);
//     }
//   };

//   if (loading) return <p className="text-center mt-10">Loading blogs...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-6">My Blogs</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {blogs.map((blog) => (
//           <div
//             key={blog._id}
//             className="border border-gray-200 rounded-lg p-4 shadow-md"
//           >
//             <h2 className="text-xl font-semibold">{blog.title}</h2>
//             {/* Render HTML content using dangerouslySetInnerHTML */}
//             <div
//               className="text-gray-600 mt-2"
//               dangerouslySetInnerHTML={{
//                 __html: blog.content.slice(0, 100) + "...",
//               }}
//             />
//             <div className="mt-4 flex gap-2">
//               <Link
//                 to={`/blog/edit/${blog._id}`}
//                 className="text-blue-500 hover:text-blue-700"
//               >
//                 Edit
//               </Link>
//               <button
//                 onClick={() => handleDeleteBlog(blog._id)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default EducatorBlogs;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Edit, Trash } from "lucide-react";
import { AppContext } from "../../context/AppContext";

const EducatorBlogs = () => {
  const { backendUrl } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState({});
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(`${backendUrl}/api/blogs/educator/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setBlogs(res.data.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load blogs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl, getToken]);

  const handleDeleteBlog = async (blogId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleteStatus((prev) => ({ ...prev, [blogId]: "deleting" }));

      const token = await getToken();
      await axios.delete(`${backendUrl}/api/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      setDeleteStatus((prev) => ({ ...prev, [blogId]: "success" }));

      setTimeout(() => {
        setDeleteStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[blogId];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      console.error("Error deleting blog:", error);
      setDeleteStatus((prev) => ({ ...prev, [blogId]: "error" }));
      alert(
        error.response?.data?.message ||
          "Failed to delete blog. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Blog Posts
        </h1>
        <Link
          to="/blog/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            No blog posts yet
          </h2>
          <p className="text-gray-500 mb-4">
            Start by creating your first blog post
          </p>
          <Link
            to="/blog/create"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {blog.title}
                        </div>
                        <div
                          className="text-sm text-gray-500 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            blog.published
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <Link
                            to={`/blog/edit/${blog._id}`}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(blog._id)}
                            disabled={deleteStatus[blog._id] === "deleting"}
                            className={`flex items-center ${
                              deleteStatus[blog._id] === "deleting"
                                ? "text-gray-400 cursor-wait"
                                : "text-red-600 hover:text-red-900"
                            }`}
                            title="Delete"
                          >
                            {deleteStatus[blog._id] === "deleting" ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </span>
                            )}
                          </button>
                        </div>
                        {deleteStatus[blog._id] === "success" && (
                          <div className="text-green-600 text-xs mt-1">
                            Blog deleted successfully
                          </div>
                        )}
                        {deleteStatus[blog._id] === "error" && (
                          <div className="text-red-600 text-xs mt-1">
                            Error deleting blog
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {blog.title}
                  </h3>
                  <span
                    className={`px-2 text-xs leading-5 font-semibold rounded-full ${
                      blog.published
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div
                  className="text-sm text-gray-500 line-clamp-3 mb-3"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
                  <Link
                    to={`/blog/edit/${blog._id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    disabled={deleteStatus[blog._id] === "deleting"}
                    className={`flex items-center text-sm font-medium ${
                      deleteStatus[blog._id] === "deleting"
                        ? "text-gray-400 cursor-wait"
                        : "text-red-600 hover:text-red-800"
                    }`}
                  >
                    {deleteStatus[blog._id] === "deleting" ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </span>
                    )}
                  </button>
                </div>

                {deleteStatus[blog._id] === "success" && (
                  <div className="text-green-600 text-xs mt-2 text-center">
                    Blog deleted successfully
                  </div>
                )}
                {deleteStatus[blog._id] === "error" && (
                  <div className="text-red-600 text-xs mt-2 text-center">
                    Error deleting blog
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EducatorBlogs;
