// import { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import AssignmentModal from "./AssignmentModal"; // Import the modal component
// import { AppContext } from "../context/AppContext";

// const AssignmentList = () => {
//   const { backendUrl } = useContext(AppContext);
//   const { courseId } = useParams();
//   const [assignments, setAssignments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
//   const [selectedFileUrl, setSelectedFileUrl] = useState(""); // State to store the selected file URL

//   useEffect(() => {
//     const fetchAssignments = async () => {
//       console.log("Course ID from URL:", courseId);

//       if (!courseId) {
//         setError("Course ID is missing.");
//         setLoading(false);
//         return;
//       }

//       try {
//         console.log("Fetching assignments for courseId:", courseId);
//         const response = await axios.get(
//           `${backendUrl}/api/assignments/${courseId}`
//         );

//         console.log("API Response:", response.data);

//         if (response.data.assignments && response.data.assignments.length > 0) {
//           console.log("Assignments found:", response.data.assignments);
//           setAssignments(response.data.assignments);
//         } else {
//           console.log("No assignments found for this course.");
//           setError("No assignments found for this course.");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching assignments:", error);
//         setError("Error fetching assignments.");
//         setLoading(false);
//       }
//     };

//     fetchAssignments();
//   }, [courseId]);

//   // Function to handle "View Assignment" click
//   const handleViewAssignment = (fileUrl) => {
//     setSelectedFileUrl(fileUrl); // Set the selected file URL
//     setIsModalOpen(true); // Open the modal
//   };

//   // Function to close the modal
//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedFileUrl("");
//   };

//   if (loading)
//     return (
//       <div className="text-center text-gray-500">Loading assignments...</div>
//     );
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="min-h-screen flex flex-col items-center py-6 bg-gray-100">
//       <div className="max-w-4xl w-full bg-white bg-opacity-40 backdrop-blur-lg rounded-xl p-8 shadow-lg">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
//           Assignments
//         </h2>
//         {assignments.length === 0 ? (
//           <p className="text-center text-gray-600">
//             No assignments submitted yet.
//           </p>
//         ) : (
//           <ul className="space-y-6">
//             {assignments.map((assignment) => (
//               <li
//                 key={assignment._id}
//                 className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
//               >
//                 <p className="font-semibold text-lg text-gray-700">
//                   <strong>Name:</strong> {assignment.name}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Email:</strong> {assignment.email}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Submitted On:</strong>{" "}
//                   {new Date(assignment.submittedAt).toLocaleDateString()}
//                 </p>
//                 <p className="text-gray-600">
//                   <strong>Status:</strong> {assignment.status}
//                 </p>
//                 {assignment.status === "Reviewed" && (
//                   <div className="mt-4 text-gray-700">
//                     <p>
//                       <strong>Feedback:</strong> {assignment.feedback}
//                     </p>
//                     <p>
//                       <strong>Score:</strong> {assignment.score}/100
//                     </p>
//                     <p>
//                       <strong>Reviewed On:</strong>{" "}
//                       {assignment.reviewedAt
//                         ? new Date(assignment.reviewedAt).toLocaleDateString()
//                         : "Not Reviewed Yet"}
//                     </p>
//                   </div>
//                 )}
//                 <div className="mt-4">
//                   <button
//                     onClick={() =>
//                       handleViewAssignment(
//                         `${backendUrl}/uploads/${assignment.filePath}`
//                       )
//                     }
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     View Assignment
//                   </button>
//                 </div>
//                 <div className="mt-2">
//                   <a
//                     href={`/educator/assignments/review/${assignment._id}`}
//                     className="text-green-500 hover:text-green-700"
//                   >
//                     Review Assignment
//                   </a>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Render the modal if it's open */}
//       {isModalOpen && (
//         <AssignmentModal fileUrl={selectedFileUrl} onClose={handleCloseModal} />
//       )}
//     </div>
//   );
// };

// export default AssignmentList;

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AssignmentModal from "./AssignmentModal";
import { AppContext } from "../context/AppContext";

const AssignmentList = () => {
  const { backendUrl } = useContext(AppContext);
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/assignments/${courseId}`
        );

        if (response.data.assignments && response.data.assignments.length > 0) {
          setAssignments(response.data.assignments);
        } else {
          setError("No assignments found for this course.");
        }
      } catch (error) {
        console.error("Error fetching assignments:", error);
        setError("Error fetching assignments.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAssignments();
    } else {
      setError("Course ID is missing.");
      setLoading(false);
    }
  }, [courseId, backendUrl]);

  const handleViewAssignment = (fileId) => {
    if (!fileId) {
      toast.error("No file attached to this assignment");
      return;
    }
    setSelectedFileId(fileId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFileId(null);
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-gray-100">
      <div className="max-w-4xl w-full bg-white bg-opacity-40 backdrop-blur-lg rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Assignments
        </h2>

        {assignments.length === 0 ? (
          <p className="text-center text-gray-600">
            No assignments submitted yet.
          </p>
        ) : (
          <ul className="space-y-6">
            {assignments.map((assignment) => (
              <li
                key={assignment._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Assignment details */}
                <p className="font-semibold text-lg text-gray-700">
                  <strong>Name:</strong> {assignment.name}
                </p>
                <p className="text-gray-600">
                  <strong>Email:</strong> {assignment.email}
                </p>
                <p className="text-gray-600">
                  <strong>Submitted On:</strong>{" "}
                  {new Date(assignment.submittedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Status:</strong> {assignment.status}
                </p>
                {assignment.status === "Reviewed" && (
                  <div className="mt-4 text-gray-700">
                    <p>
                      <strong>Feedback:</strong> {assignment.feedback}
                    </p>
                    <p>
                      <strong>Score:</strong> {assignment.score}/100
                    </p>
                    <p>
                      <strong>Reviewed On:</strong>{" "}
                      {assignment.reviewedAt
                        ? new Date(assignment.reviewedAt).toLocaleDateString()
                        : "Not Reviewed Yet"}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleViewAssignment(assignment.fileId)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Assignment
                  </button>
                  <a
                    href={`${backendUrl}/api/assignments/file/${assignment.fileId}`}
                    download
                    className="text-green-500 hover:text-green-700"
                  >
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <AssignmentModal
          fileId={selectedFileId}
          onClose={handleCloseModal}
          backendUrl={backendUrl}
        />
      )}
    </div>
  );
};

export default AssignmentList;
