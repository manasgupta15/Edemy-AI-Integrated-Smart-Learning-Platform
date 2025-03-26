// import { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import axios from "axios";
// import { AppContext } from "../context/AppContext";

// const SubmitAssignment = () => {
//   const { backendUrl } = useContext(AppContext);
//   const { id } = useParams();
//   const { user } = useUser();

//   const [formData, setFormData] = useState({
//     courseId: id,
//     studentId: "",
//     name: "",
//     email: "",
//     file: null,
//     status: "Pending",
//   });

//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         ...formData,
//         studentId: user.id,
//         name: `${user.firstName} ${user.lastName}`,
//         email: user.primaryEmailAddress?.emailAddress || "",
//       });
//     }
//   }, [user]);

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, file: e.target.files[0] });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const formDataToSend = new FormData();
//   //   formDataToSend.append("courseId", formData.courseId);
//   //   formDataToSend.append("studentId", formData.studentId);
//   //   formDataToSend.append("name", formData.name);
//   //   formDataToSend.append("email", formData.email);
//   //   formDataToSend.append("status", formData.status);
//   //   formDataToSend.append("file", formData.file);

//   //   try {
//   //     const response = await axios.post(
//   //       "http://localhost:5000/api/assignments/submit",
//   //       formDataToSend,
//   //       {
//   //         headers: { "Content-Type": "multipart/form-data" },
//   //       }
//   //     );
//   //     setMessage("🎉 Assignment submitted successfully!");
//   //     console.log(response.data);
//   //   } catch (error) {
//   //     setMessage("⚠️ Error submitting assignment");
//   //     console.error(error);
//   //   }
//   // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append("courseId", formData.courseId);
//     formDataToSend.append("studentId", formData.studentId);
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("email", formData.email);
//     formDataToSend.append("status", formData.status);
//     formDataToSend.append("file", formData.file); // Ensure the file is appended

//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/assignments/submit`,
//         formDataToSend,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
//       setMessage("🎉 Assignment submitted successfully!");
//       console.log(response.data);
//     } catch (error) {
//       setMessage("⚠️ Error submitting assignment");
//       console.error(error);
//     }
//   };
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-900">
//       <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
//         <h2 className="text-2xl font-semibold text-white text-center mb-4">
//           📂 Submit Assignment
//         </h2>

//         {message && (
//           <p className="text-center text-lg text-green-400 bg-green-900/20 p-2 rounded-lg">
//             {message}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <div>
//             <label className="block text-white text-sm font-medium">
//               Student ID:
//             </label>
//             <input
//               type="text"
//               name="studentId"
//               value={formData.studentId}
//               disabled
//               className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-white text-sm font-medium">
//               Student Name:
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               disabled
//               className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-white text-sm font-medium">
//               Student Email:
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               disabled
//               className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring focus:ring-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block text-white text-sm font-medium">
//               Upload File:
//             </label>
//             <input
//               type="file"
//               name="file"
//               onChange={handleFileChange}
//               required
//               className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 cursor-pointer"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-200"
//           >
//             🚀 Submit Assignment
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SubmitAssignment;

import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const SubmitAssignment = () => {
  const { backendUrl } = useContext(AppContext);
  const { id } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth(); // Add useAuth for token access

  const [formData, setFormData] = useState({
    courseId: id,
    studentId: "",
    name: "",
    email: "",
    file: null,
    status: "Pending",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  //   if (!formData.file) {
  //     setMessage("⚠️ Please select a file to upload");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setMessage("");

  //   try {
  //     const token = await getToken(); // Get the authentication token
  //     const formDataToSend = new FormData();

  //     // Append all form data
  //     formDataToSend.append("courseId", formData.courseId);
  //     formDataToSend.append("studentId", formData.studentId);
  //     formDataToSend.append("name", formData.name);
  //     formDataToSend.append("email", formData.email);
  //     formDataToSend.append("status", formData.status);
  //     formDataToSend.append("file", formData.file);

  //     const response = await axios.post(
  //       `${backendUrl}/api/assignments/submit`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         withCredentials: true, // Important for session-based auth
  //       }
  //     );

  //     setMessage("🎉 Assignment submitted successfully!");
  //     console.log("Submission successful:", response.data);

  //     // Reset form after successful submission
  //     setFormData({
  //       ...formData,
  //       file: null,
  //     });
  //     document.querySelector('input[type="file"]').value = ""; // Clear file input
  //   } catch (error) {
  //     console.error("Submission error:", error);

  //     let errorMessage = "⚠️ Error submitting assignment";
  //     if (error.response) {
  //       // Handle different types of 400 errors
  //       if (error.response.data?.message) {
  //         errorMessage = `⚠️ ${error.response.data.message}`;
  //       } else if (error.response.status === 413) {
  //         errorMessage =
  //           "⚠️ File size too large. Please upload a smaller file.";
  //       } else if (error.response.status === 415) {
  //         errorMessage =
  //           "⚠️ Unsupported file type. Please upload a different file format.";
  //       }
  //     }

  //     setMessage(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      setMessage("⚠️ Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const token = await getToken();
      const formDataToSend = new FormData();

      formDataToSend.append("courseId", formData.courseId);
      formDataToSend.append("studentId", formData.studentId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("file", formData.file);

      const response = await axios.post(
        `${backendUrl}/api/assignments/submit`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("🎉 Assignment submitted successfully!");
      setFormData({ ...formData, file: null });

      // To download later: `${backendUrl}/api/assignments/file/${response.data.assignment.fileId}`
    } catch (error) {
      let errorMessage = "⚠️ Error submitting assignment";

      if (error.response?.data?.error) {
        errorMessage = `⚠️ ${error.response.data.error}`;
      }

      setMessage(errorMessage);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-6 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          📂 Submit Assignment
        </h2>

        {message && (
          <p
            className={`text-center text-lg p-2 rounded-lg ${
              message.startsWith("🎉")
                ? "text-green-400 bg-green-900/20"
                : "text-red-400 bg-red-900/20"
            }`}
          >
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
              Upload File (PDF, DOCX, or ZIP):
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.zip"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-300 mt-1">
              Max file size: 5MB. Supported formats: PDF, DOC, DOCX, ZIP
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.file}
            className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Submitting...
              </span>
            ) : (
              "🚀 Submit Assignment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitAssignment;
