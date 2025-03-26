import { useState, useEffect, useContext } from "react";
import CreateBlog from "./CreateBlog";
import BlogList from "./BlogList";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";

const BlogPage = () => {
  const { backendUrl } = useContext(AppContext);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateBlog, setShowCreateBlog] = useState(false);

  // Fetch Blogs from API
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/blogs`);
      setBlogs(res.data.success ? res.data.blogs : []);
    } catch (err) {
      setError("Failed to load blogs. Check server.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Function to add new blog & refresh list
  const addNewBlog = (newBlog) => {
    setBlogs((prevBlogs) => [newBlog, ...prevBlogs]);
    setShowCreateBlog(false); // Close modal after submission
  };

  return (
    <div className="pb-14 px-8 md:px-0 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 drop-shadow-md mt-4">
          Explore Amazing Blogs
        </h2>
        <p className="text-lg text-gray-700 mt-3 max-w-3xl mx-auto">
          Dive into a world of knowledge, ideas, and experiences. Discover,
          read, and share amazing stories from various authors.
        </p>
      </div>

      {/* Blog List Component */}
      {loading ? (
        <p className="text-center">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <BlogList blogs={blogs} />
      )}

      {/* Create Blog Button */}
      <div className="text-center mt-10">
        <button
          onClick={() => setShowCreateBlog(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-full text-lg shadow-lg 
                     hover:scale-105 transform transition-all duration-300 hover:shadow-2xl"
        >
          ✍️ Create New Blog
        </button>
      </div>

      {/* Create Blog Modal */}
      {showCreateBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowCreateBlog(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <CreateBlog
              onClose={() => setShowCreateBlog(false)}
              addNewBlog={addNewBlog}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
