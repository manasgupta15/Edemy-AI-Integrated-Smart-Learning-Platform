// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "@clerk/clerk-react";

// const EducatorQueries = () => {
//   const [queries, setQueries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { getToken } = useAuth();

//   useEffect(() => {
//     const fetchQueries = async () => {
//       try {
//         const userToken = await getToken();
//         const response = await axios.get("http://localhost:5000/api/queries", {
//           headers: { Authorization: `Bearer ${userToken}` },
//         });

//         if (response.status === 200 && Array.isArray(response.data)) {
//           setQueries(response.data);
//         } else {
//           setError("No queries found or invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching queries:", error.response?.data || error);
//         setError(
//           error.response?.data?.message ||
//             "An error occurred while fetching queries"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQueries();
//   }, []);

//   if (loading)
//     return (
//       <p className="text-center text-lg font-semibold mt-4">
//         Loading queries...
//       </p>
//     );
//   if (error)
//     return (
//       <p className="text-center text-red-500 font-semibold mt-4">{error}</p>
//     );

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">
//         Educator Queries
//       </h2>
//       {queries.length === 0 ? (
//         <p className="text-center text-gray-500">No queries found</p>
//       ) : (
//         <div className="grid gap-4">
//           {queries.map((query) => (
//             <div
//               key={query._id}
//               className="bg-white p-5 rounded-lg shadow-md border"
//             >
//               <p className="text-lg font-semibold text-blue-700">
//                 {query.reason}
//               </p>
//               <p className="text-gray-700 mt-1">{query.message}</p>
//               <p
//                 className={`mt-2 font-semibold ${
//                   query.status === "answered"
//                     ? "text-green-600"
//                     : "text-yellow-600"
//                 }`}
//               >
//                 Status: {query.status}
//               </p>
//               {query.response && (
//                 <div className="mt-3 p-3 bg-gray-100 rounded-lg">
//                   <p className="font-semibold text-green-700">Response:</p>
//                   <p className="text-gray-700">{query.response}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EducatorQueries;

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext"; // ✅ AppContext for API
import { toast } from "react-toastify";

const EducatorQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseText, setResponseText] = useState({});
  const { getToken } = useAuth();
  const { backendUrl } = useContext(AppContext); // ✅ Get backend URL

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const userToken = await getToken();
      const response = await axios.get(`${backendUrl}/api/queries`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        setQueries(response.data);
      } else {
        setError("No queries found or invalid response format.");
      }
    } catch (error) {
      console.error("Error fetching queries:", error.response?.data || error);
      setError("Failed to load queries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle response submission
  const handleResponseSubmit = async (queryId) => {
    if (!responseText[queryId]) {
      toast.warn("Please enter a response.");
      return;
    }

    try {
      const userToken = await getToken();
      const response = await axios.put(
        `${backendUrl}/api/queries/${queryId}`,
        { response: responseText[queryId] },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (response.data.success) {
        toast.success("Query answered successfully!");
        fetchQueries(); // Refresh the list
      } else {
        toast.error("Failed to update query.");
      }
    } catch (error) {
      console.error(
        "Error responding to query:",
        error.response?.data || error
      );
      toast.error("Error responding to query.");
    }
  };

  return (
    <div className="flex">
      {/* ✅ Main Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          📩 Educator Queries
        </h2>

        {loading && (
          <p className="text-center text-lg font-semibold">
            Loading queries...
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {queries.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-500">No queries found.</p>
        ) : (
          <div className="grid gap-6">
            {queries.map((query) => (
              <div
                key={query._id}
                className="bg-white p-5 rounded-lg shadow-md border"
              >
                <h3 className="text-lg font-semibold text-blue-700">
                  {query.reason}
                </h3>
                <p className="text-gray-700 mt-1">{query.message}</p>
                <p
                  className={`mt-2 font-semibold ${
                    query.status === "answered"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  Status: {query.status}
                </p>

                {/* ✅ Show previous response if available */}
                {query.response && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-lg">
                    <p className="font-semibold text-green-700">Response:</p>
                    <p className="text-gray-700">{query.response}</p>
                  </div>
                )}

                {/* ✅ Response Input for Pending Queries */}
                {query.status !== "answered" && (
                  <div className="mt-3">
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="Write your response..."
                      value={responseText[query._id] || ""}
                      onChange={(e) =>
                        setResponseText({
                          ...responseText,
                          [query._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleResponseSubmit(query._id)}
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                    >
                      Submit Response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducatorQueries;
