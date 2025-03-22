import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourseDetails from "./pages/student/CourseDetails";
import Player from "./pages/student/Player";
import MyEnrollments from "./pages/student/MyEnrollments";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import Dashboard from "./pages/educator/Dashboard";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import AddQuiz from "./pages/educator/AddQuiz";
import Navbar from "./components/student/Navbar";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";
import AssignmentList from "./components/AssignmentList";

// ✅ Import Quiz & Assignment Components
import QuizList from "./components/Quiz/QuizList";
import QuizPage from "./components/Quiz/QuizPage";
import QuizResult from "./components/Quiz/QuizResult";
import ReviewAssignment from "./components/ReviewAssignment"; // Add this import
import SubmitAssignment from "./components/SubmitAssignment";
import GenerateCertificate from "./pages/student/GenerateCertificate"; // Import the new component
import PaymentSuccess from "./pages/PaymentSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import Chatbot from "./components/Chatbot/Chatbot";
import LiveCompiler from "./pages/LiveCompiler";
import CollabRoom from "./components/CollabRoom";
import QueryForm from "./pages/QueryForm";
import UserQueries from "./pages/UserQueries";
import EducatorQueries from "./pages/EducatorQueries";
const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <Routes>
        {/* ✅ Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        {/* ✅ Chatbot Route */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/compiler" element={<LiveCompiler />} />
        <Route path="/collab" element={<CollabRoom />} />
        {/* ✅ Quiz Routes */}
        <Route path="/quizzes/:courseId" element={<QuizList />} />
        <Route path="/quiz/:quizId" element={<QuizPage />} />
        <Route path="/quiz/:quizId/result" element={<QuizResult />} />
        <Route
          path="/assignment/upload/:id"
          element={<SubmitAssignment />}
        />{" "}
        {/* Dynamic Route */}
        {/* ✅ Certificate Route */}
        <Route
          path="/generate-certificate/:courseId"
          element={<GenerateCertificate />}
        />
        {/* ✅ Query Routes */}
        <Route path="/submit-query" element={<QueryForm />} />
        <Route path="/my-queries" element={<UserQueries />} />
        {/* <Route path="/educator/queries" element={<EducatorQueries />} /> */}
        {/* ✅ Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<Dashboard />} />{" "}
          {/* Default route for educator */}
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
          <Route path="add-quiz" element={<AddQuiz />} /> {/* New Route */}
          <Route
            path="assignments/view/:courseId"
            element={<AssignmentList />}
          />
          <Route
            path="assignments/review/:assignmentId"
            element={<ReviewAssignment />}
          />
          <Route path="queries" element={<EducatorQueries />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
