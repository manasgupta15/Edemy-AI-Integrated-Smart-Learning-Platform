import { useAuth, useUser } from "@clerk/clerk-react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { AppContext } from "../../../context/AppContext";

const CreateBlog = ({ onClose }) => {
  const { backendUrl } = useContext(AppContext);
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Tiptap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bold: true,
        italic: true,
        strike: true,
        blockquote: true,
        code: true,
        codeBlock: true,
        listItem: true,
        orderedList: true,
        bulletList: true,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: "", // Initial content
  });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (!isLoaded) {
      console.log("⌛ Waiting for Clerk to load user...");
    } else if (!user) {
      setError("User not authenticated. Please log in.");
    } else {
      console.log("✅ User authenticated:", user);
    }
  }, [isLoaded, user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for immediate display
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setImage(file);
    }
  };

  const uploadImageToBackend = async () => {
    if (!image) return null;

    try {
      const userToken = await getToken();
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        `${backendUrl}/api/blogs/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }

      return response.data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Failed to upload image");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const userToken = await getToken();
      let uploadedImageId = null;

      if (image) {
        uploadedImageId = await uploadImageToBackend();
        if (!uploadedImageId) {
          setLoading(false);
          return;
        }
      }

      const content = editor.getHTML();

      const blogData = {
        title,
        content,
        tags,
        category,
        image: uploadedImageId,
        published,
        authorId: user.id,
        authorName: user.fullName || "Unknown",
      };

      const response = await axios.post(`${backendUrl}/api/blogs`, blogData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      });

      alert("Blog created successfully!");
      onClose();
    } catch (error) {
      setError("Failed to create blog.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <p className="text-center text-white">Loading authentication...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900/80 fixed inset-0 z-50">
      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Blog</h2>
        {error && <p className="text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            className="p-2 bg-white/20 rounded-lg border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          {/* Toolbar */}
          <div className="bg-white/20 rounded-lg p-2">
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 ${
                  editor.isActive("bold")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 ${
                  editor.isActive("italic")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1 ${
                  editor.isActive("underline")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                Underline
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={`p-1 ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                H1
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-1 ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                H2
              </button>
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`p-1 ${
                  editor.isActive("heading", { level: 3 })
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                H3
              </button>
            </div>
            {/* Editor Content */}
            <EditorContent
              editor={editor}
              className="text-white placeholder-gray-300 min-h-[200px]"
            />
          </div>
          <input
            className="p-2 bg-white/20 rounded-lg border border-gray-300 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <select
            className="p-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option className="text-black" value="Uncategorized">
              Uncategorized
            </option>
            <option className="text-black" value="Technology">
              Technology
            </option>
            <option className="text-black" value="Education">
              Education
            </option>
            <option className="text-black" value="Health">
              Health
            </option>
          </select>
          <div>
            <label className="block">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-gray-300"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded-lg w-full"
              />
            )}
          </div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-5 w-5"
            />
            <span>Publish Now</span>
          </label>
          <button
            type="submit"
            className="p-2 bg-blue-500 hover:bg-blue-700 transition-all text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Publishing..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
