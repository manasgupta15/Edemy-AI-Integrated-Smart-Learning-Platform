import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/student/Loading";
import { AppContext } from "../../context/AppContext";

const ViewQuizResults = () => {
  const { backendUrl, getToken } = useContext(AppContext);
  const { quizId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${backendUrl}/api/quiz/results/${quizId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Fetch user details for each result
        const updatedResults = await Promise.all(
          data.map(async (result) => {
            try {
              const userResponse = await axios.get(
                `https://api.clerk.dev/v1/users/${result.userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${
                      import.meta.env.VITE_CLERK_SECRET
                    }`,
                  },
                }
              );

              return {
                ...result,
                userName:
                  userResponse.data.first_name +
                  " " +
                  userResponse.data.last_name,
                userImage: userResponse.data.image_url,
              };
            } catch (error) {
              console.error("Error fetching user details:", error);
              return { ...result, userName: "Unknown", userImage: "" };
            }
          })
        );

        setResults(updatedResults);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, getToken, backendUrl]);

  return loading ? (
    <Loading />
  ) : (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
        📊 Quiz Results
      </h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Student</th>
              <th className="border p-3 text-center">Score</th>
              <th className="border p-3 text-center">Total Questions</th>
              <th className="border p-3 text-center">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="border p-3 flex items-center gap-3">
                  <img
                    src={result.userImage || "https://via.placeholder.com/50"}
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  {result.userName}
                </td>
                <td className="border p-3 text-center">{result.score}</td>
                <td className="border p-3 text-center">
                  {result.totalQuestions}
                </td>
                <td className="border p-3 text-center">
                  {new Date(result.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewQuizResults;
