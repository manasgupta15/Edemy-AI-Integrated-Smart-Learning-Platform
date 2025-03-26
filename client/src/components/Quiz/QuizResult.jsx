import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const QuizResult = () => {
  const { backendUrl } = useContext(AppContext);
  const { quizId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/quiz/result/${quizId}`
        );
        setResult(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };
    fetchResult();
  }, [quizId]);

  return result ? (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ✅ Score Card */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          🎯 Quiz Results
        </h2>
        <p className="text-xl text-gray-700 font-medium">
          Your Score:{" "}
          <span
            className={`font-bold ${
              result.score / result.total >= 0.5
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {result.score} / {result.total}
          </span>
        </p>
      </div>

      {/* ✅ Answer Review Section */}
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          📌 Review Answers
        </h3>
        {result.correctAnswers.map((q, index) => (
          <div
            key={index}
            className="mt-4 p-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <p className="font-medium text-lg">{q.questionText}</p>
            <p className="text-gray-600">
              Your Answer:{" "}
              <span
                className={`font-semibold ${
                  q.userAnswer === q.correctAnswer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {q.userAnswer}
              </span>
            </p>
            <p className="text-gray-700">
              ✔️ Correct Answer:{" "}
              <span className="font-semibold text-blue-600">
                {q.correctAnswer}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600 text-lg mt-10">
      Loading results...
    </p>
  );
};

export default QuizResult;
