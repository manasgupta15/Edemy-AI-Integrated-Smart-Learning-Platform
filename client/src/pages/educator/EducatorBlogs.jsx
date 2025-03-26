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

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Edit, Trash } from "lucide-react"; // Import icons for edit and delete

const EducatorBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/blogs/educator/blogs",
          {
            withCredentials: true,
          }
        );
        setBlogs(res.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        withCredentials: true,
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId)); // Remove deleted blog from the list
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blogs...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Blogs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Content</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr
                key={blog._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{blog.title}</td>
                <td className="py-3 px-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: blog.content.slice(0, 100) + "...",
                    }}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/blog/edit/${blog._id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={18} /> {/* Edit icon */}
                    </Link>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} /> {/* Delete icon */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EducatorBlogs;
