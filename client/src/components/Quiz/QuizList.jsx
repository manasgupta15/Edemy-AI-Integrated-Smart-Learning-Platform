import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const QuizList = () => {
  const { backendUrl } = useContext(AppContext);
  const { courseId } = useParams();
  const { user } = useUser(); // ✅ Get user ID from Clerk
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set());

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/quiz/${courseId}`);
        setQuizzes(data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  const fetchCompletedQuizzes = async () => {
    try {
      if (!user) return;
      const completed = new Set();
      for (const quiz of quizzes) {
        try {
          const res = await axios.get(
            `${backendUrl}/api/quiz/result/${quiz._id}/${user.id}`
          );
          if (res.data) {
            completed.add(quiz._id);
          }
        } catch (error) {
          console.log(`Quiz ${quiz._id} not completed yet.`);
        }
      }
      setCompletedQuizzes(completed);
    } catch (error) {
      console.error("Error fetching completed quizzes:", error);
    }
  };

  useEffect(() => {
    if (quizzes.length > 0) {
      fetchCompletedQuizzes();
    }
  }, [quizzes, user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Heading */}
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6">
        📚 Available Quizzes
      </h2>

      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 border border-gray-300 transition-transform transform hover:scale-105 duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800">
                {quiz.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2">
                ⏳ Duration:{" "}
                <span className="font-medium text-gray-900">
                  {quiz.duration} mins
                </span>
              </p>

              {completedQuizzes.has(quiz._id) ? (
                <button
                  className="mt-5 w-full bg-green-500 text-white py-2 rounded-lg font-semibold shadow-md cursor-not-allowed"
                  disabled
                >
                  ✅ Completed
                </button>
              ) : (
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="mt-5 w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
                >
                  🚀 Start Quiz
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6 text-lg">
          ❌ No quizzes available for this course.
        </p>
      )}
    </div>
  );
};

export default QuizList;
