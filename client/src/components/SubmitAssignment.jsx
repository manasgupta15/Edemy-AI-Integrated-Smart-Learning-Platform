import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const SubmitAssignment = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const { user } = useUser();

  const [formData, setFormData] = useState({
    courseId: id,
    studentId: "",
    name: "",
    email: "",
    file: null,
    status: "Pending",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        studentId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("courseId", formData.courseId);
  //   formDataToSend.append("studentId", formData.studentId);
  //   formDataToSend.append("name", formData.name);
  //   formDataToSend.append("email", formData.email);
  //   formDataToSend.append("status", formData.status);
  //   formDataToSend.append("file", formData.file);

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:5000/api/assignments/submit",
  //       formDataToSend,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       }
  //     );
  //     setMessage("🎉 Assignment submitted successfully!");
  //     console.log(response.data);
  //   } catch (error) {
  //     setMessage("⚠️ Error submitting assignment");
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("courseId", formData.courseId);
    formDataToSend.append("studentId", formData.studentId);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("file", formData.file); // Ensure the file is appended

    try {
      const response = await axios.post(
        `${backendUrl}/api/assignments/submit`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage("🎉 Assignment submitted successfully!");
      console.log(response.data);
    } catch (error) {
      setMessage("⚠️ Error submitting assignment");
      console.error(error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          📂 Submit Assignment
        </h2>

        {message && (
          <p className="text-center text-lg text-green-400 bg-green-900/20 p-2 rounded-lg">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block text-white text-sm font-medium">
              Student ID:
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium">
              Student Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium">
              Student Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium">
              Upload File:
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200"
          >
            🚀 Submit Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignment;
