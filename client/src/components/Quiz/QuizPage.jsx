import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // ✅ Fetch user automatically from Clerk
import { AppContext } from "../../context/AppContext";

const QuizPage = () => {
  const { backendUrl } = useContext(AppContext);
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ Get logged-in user details
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [evaluation, setEvaluation] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null); // ✅ Initialize as null (will be set dynamically)

  // ✅ Immediately show "Please login" if user is not logged in
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
          <h2 className="text-3xl font-bold text-red-600 flex justify-center items-center gap-2">
            ⚠️ Please Log In
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            You need to log in to attempt this quiz.
          </p>
          <button
            disabled={true}
            className="mt-4 px-6 py-3 bg-gray-400 text-white text-lg font-semibold rounded-lg shadow-md"
          >
            🔑 Log In to Continue
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/quiz/single/${quizId}`
        );
        setQuiz(data);

        if (data.duration) {
          setTimeLeft(data.duration * 60); // ✅ Set timer based on quiz duration from AddQuiz.jsx
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    const checkIfSubmitted = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/quiz/result/${quizId}/${user.id}`
        );
        if (data) {
          setScore(data.score);
          setTotalQuestions(data.totalQuestions);
          setSubmitted(true);
        }
      } catch (error) {
        console.log("No previous submission found.");
      }
    };

    fetchQuiz();
    checkIfSubmitted();
  }, [quizId, user]);

  // ✅ Timer Effect - Runs only when `timeLeft` is set
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return; // ✅ Ensures quiz starts properly

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ Auto-submit when time runs out (only runs once)
  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({ ...answers, [questionIndex]: selectedOption });
  };

  const handleSubmit = async () => {
    try {
      if (!quiz) return;

      const { data } = await axios.post(`${backendUrl}/api/quiz/submit`, {
        userId: user.id,
        quizId,
        answers,
      });

      setScore(data.score);
      setTotalQuestions(data.totalQuestions);
      setEvaluation(data.evaluation); // ✅ Store evaluation details
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setError(error.response?.data?.error || "Failed to submit quiz.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading quiz...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        📝 {quiz.title}
      </h2>

      {submitted ? (
        <div className="p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
          <h3 className="text-2xl font-semibold text-green-600 text-center">
            🎉 Quiz Completed!
          </h3>
          <p className="text-lg text-gray-700 text-center mt-2">
            Your Score:{" "}
            <span className="font-bold">
              {score} / {totalQuestions}
            </span>
          </p>

          <h3 className="text-xl font-medium mt-6 text-gray-800">
            📌 Question Review:
          </h3>
          {evaluation.map((item, index) => (
            <div key={index} className="mt-3 p-3 border rounded bg-gray-100">
              <p className="font-semibold">
                Q{index + 1}: {item.question}
              </p>
              <p className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                ➡️ Your Answer: {item.userAnswer}
              </p>
              <p className="text-gray-700">
                ✔️ Correct Answer: {item.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
          {/* ✅ Timer UI */}
          <div className="mb-6">
            <div className="relative w-full bg-gray-200 rounded-full h-3">
              <div
                className="absolute top-0 left-0 h-3 bg-blue-500 rounded-full transition-all"
                style={{
                  width: `${(timeLeft / (quiz?.duration * 60)) * 100}%`,
                }}
              ></div>
            </div>
            <p className="text-center text-lg font-bold text-red-600 mt-2">
              ⏳ Time Left: {formatTime(timeLeft)}
            </p>
          </div>

          {quiz.questions.map((q, index) => (
            <div
              key={index}
              className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded-lg shadow-sm"
            >
              <p className="font-medium text-lg">{q.questionText}</p>
              {q.options.map((opt) => (
                <label key={opt} className="block mt-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    onChange={() => handleAnswerChange(index, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
          >
            🚀 Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
