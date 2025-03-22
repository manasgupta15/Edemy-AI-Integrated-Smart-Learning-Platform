import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // ✅ Get logged-in educator
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext"; // ✅ Import AppContext

const AddQuiz = () => {
  const { user } = useUser(); // ✅ Get educator info
  const navigate = useNavigate();
  const { backendUrl, isEducator, getToken } = useContext(AppContext); // ✅ Use AppContext

  const [courses, setCourses] = useState([]); // ✅ Educator's courses
  const [selectedCourse, setSelectedCourse] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [duration, setDuration] = useState(10);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      questionType: "MCQ", // ✅ Default to MCQ
    },
  ]);

  // ✅ Fetch Educator's Courses using AppContext Logic
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.warn("No courses found.");
      }
    } catch (error) {
      toast.error("Failed to load courses. Please try again.");
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  // ✅ Handle Input Changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        questionType: "MCQ",
      },
    ]);
  };

  // ✅ Handle Quiz Submission
  const handleSubmit = async () => {
    if (!selectedCourse || !quizTitle || questions.length === 0) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const quizData = {
        courseId: selectedCourse,
        educatorId: user.id, // ✅ Pass logged-in educator ID
        title: quizTitle,
        duration,
        questions,
      };

      console.log("Submitting Quiz Data:", quizData); // ✅ Debugging Log

      await axios.post(`${backendUrl}/api/quiz/create`, quizData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      toast.success("Quiz created successfully!");
      navigate("/educator/my-courses"); // ✅ Redirect after quiz creation
    } catch (error) {
      console.error("Error creating quiz:", error.response?.data || error);
      toast.error("Failed to create quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        ✍️ Create a Quiz
      </h2>

      {/* ✅ Select Course */}
      <label className="block font-semibold text-lg">Select Course:</label>
      <select
        className="w-full p-3 border border-gray-300 rounded-lg mt-2"
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">-- Select a Course --</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.courseTitle}
          </option>
        ))}
      </select>

      {/* ✅ Quiz Title */}
      <label className="block font-semibold text-lg mt-4">Quiz Title:</label>
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-lg mt-2"
        placeholder="Enter quiz title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
      />

      {/* ✅ Quiz Duration */}
      <label className="block font-semibold text-lg mt-4">
        Duration (Minutes):
      </label>
      <input
        type="number"
        className="w-full p-3 border border-gray-300 rounded-lg mt-2"
        min="1"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />

      {/* ✅ Questions */}
      <h3 className="text-xl font-semibold mt-6">📌 Questions:</h3>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="p-4 bg-gray-50 border rounded-lg mt-4">
          <label className="block font-medium">Question {qIndex + 1}:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            placeholder="Enter question text"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
          />

          {/* ✅ Options */}
          <label className="block font-medium mt-3">Options:</label>
          {q.options.map((opt, optIndex) => (
            <input
              key={optIndex}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
              placeholder={`Option ${optIndex + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(qIndex, optIndex, e.target.value)
              }
            />
          ))}

          {/* ✅ Correct Answer */}
          <label className="block font-medium mt-3">Correct Answer:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            placeholder="Enter correct answer"
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(qIndex, "correctAnswer", e.target.value)
            }
          />

          {/* ✅ Question Type */}
          <label className="block font-medium mt-3">Question Type:</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            value={q.questionType}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionType", e.target.value)
            }
          >
            <option value="MCQ">Multiple Choice (MCQ)</option>
            <option value="TrueFalse">True/False</option>
            <option value="FillBlank">Fill in the Blank</option>
          </select>
        </div>
      ))}

      {/* ✅ Add Question Button */}
      <button
        onClick={addQuestion}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
      >
        ➕ Add Another Question
      </button>

      {/* ✅ Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
        disabled={loading}
      >
        {loading ? "⏳ Creating..." : "✅ Create Quiz"}
      </button>
    </div>
  );
};

export default AddQuiz;
