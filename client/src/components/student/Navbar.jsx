// import { Link, useLocation } from "react-router-dom";
// import { assets } from "../../assets/assets";
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
// import { useContext } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
//     useContext(AppContext);
//   const location = useLocation();
//   const isCourseListPage = location.pathname.includes("/course-list");

//   const { openSignIn } = useClerk();
//   const { user } = useUser();

//   const becomeEducator = async () => {
//     try {
//       if (isEducator) {
//         navigate("/educator");
//         return;
//       }
//       const token = await getToken();
//       const { data } = await axios.get(
//         backendUrl + "/api/educator/update-role",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (data.success) {
//         setIsEducator(true);
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div
//       className={`flex items-center justify-between px-3 sm:px-6 md:px-10 lg:px-28 border-b border-gray-400 py-5 text-sm ${
//         isCourseListPage ? "bg-white" : "bg-cyan-100/70"
//       }`}
//     >
//       <img
//         onClick={() => navigate("/")}
//         src={assets.logo}
//         alt="Logo"
//         className="w-25 lg:w-30 cursor-pointer"
//       />

//       <div className="hidden md:flex items-center gap-4 text-gray-600 text-lg">
//         <Link to="/chatbot" className="hover:text-green-600 transition-all">
//           Chatbox
//         </Link>
//         <Link to="/compiler" className="hover:text-purple-600 transition-all">
//           Compiler
//         </Link>
//         <Link to="/collab" className="hover:text-blue-600 transition-all">
//           Collaborate
//         </Link>
//         <Link to="/submit-query" className="hover:text-red-600 transition-all">
//           Submit Query
//         </Link>
//         <div className="flex items-center gap-3">
//           {user && (
//             <>
//               <a
//                 onClick={becomeEducator}
//                 className="cursor-pointer hover:text-cyan-600 transition-all"
//               >
//                 {isEducator ? "Educator Dashboard" : "Become Educator"}
//               </a>{" "}
//               <Link to="/my-enrollments" className="hover:text-cyan-600">
//                 | My Enrollments
//               </Link>
//             </>
//           )}
//         </div>
//         {user ? (
//           <UserButton />
//         ) : (
//           <a
//             onClick={() => openSignIn()}
//             className="cursor-pointer bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-all"
//           >
//             Create Account
//           </a>
//         )}
//       </div>

//       {/* Mobile View */}
//       <div className="md:hidden flex items-center gap-3 text-gray-600 text-xs">
//         <Link to="/compiler" className="hover:text-purple-600">
//           Compiler
//         </Link>
//         <Link to="/chatbot" className="hover:text-green-600">
//           Chatbox
//         </Link>
//         <Link to="/collab" className="hover:text-blue-600">
//           Collaborate
//         </Link>
//         <Link to="/submit-query" className="hover:text-red-600">
//           Submit Query
//         </Link>
//         <div className="flex items-center gap-2">
//           {user && (
//             <>
//               <a
//                 onClick={becomeEducator}
//                 className="cursor-pointer hover:text-cyan-600"
//               >
//                 {isEducator ? "Educator" : "Become Educator"}
//               </a>
//               <Link to="/my-enrollments" className="hover:text-cyan-600">
//                 Enrollments
//               </Link>
//             </>
//           )}
//         </div>
//         {user ? (
//           <UserButton />
//         ) : (
//           <a onClick={() => openSignIn()} className="cursor-pointer">
//             <img src={assets.user_icon} alt="" className="w-6" />
//           </a>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
    useContext(AppContext);
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("/course-list");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { openSignIn } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate("/educator");
        return;
      }
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/update-role",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        setIsEducator(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-3 sm:px-6 md:px-10 lg:px-28 border-b border-gray-400 py-5 text-sm ${
          isCourseListPage ? "bg-white" : "bg-cyan-100/70"
        }`}
      >
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-25 lg:w-30 cursor-pointer"
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 text-gray-600 text-lg">
          <Link
            to="/chatbot"
            className={`hover:text-green-600 transition-all ${
              location.pathname === "/chatbot"
                ? "text-green-600 font-semibold"
                : ""
            }`}
          >
            Chatbox
          </Link>
          <Link
            to="/compiler"
            className={`hover:text-purple-600 transition-all ${
              location.pathname === "/compiler"
                ? "text-purple-600 font-semibold"
                : ""
            }`}
          >
            Compiler
          </Link>
          <Link
            to="/collab"
            className={`hover:text-blue-600 transition-all ${
              location.pathname === "/collab"
                ? "text-blue-600 font-semibold"
                : ""
            }`}
          >
            Collaborate
          </Link>
          <Link
            to="/submit-query"
            className={`hover:text-red-600 transition-all ${
              location.pathname === "/submit-query"
                ? "text-red-600 font-semibold"
                : ""
            }`}
          >
            Submit Query
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <a
                  onClick={becomeEducator}
                  className={`cursor-pointer hover:text-cyan-600 transition-all ${
                    location.pathname === "/educator"
                      ? "text-cyan-600 font-semibold"
                      : ""
                  }`}
                >
                  {isEducator ? "Educator Dashboard" : "Become Educator"}
                </a>{" "}
                <Link
                  to="/my-enrollments"
                  className={`hover:text-cyan-600 transition-all ${
                    location.pathname === "/my-enrollments"
                      ? "text-cyan-600 font-semibold"
                      : ""
                  }`}
                >
                  | My Enrollments
                </Link>
              </>
            )}
          </div>
          {user ? (
            <UserButton />
          ) : (
            <a
              onClick={() => openSignIn()}
              className="cursor-pointer bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-all hover:shadow-md active:scale-95"
            >
              Create Account
            </a>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleMenu}
            className="text-gray-600 focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
          {user && !isMenuOpen && <UserButton />}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden bg-white shadow-lg py-3 px-4 border-b border-gray-200">
          <div className="flex flex-col space-y-4 text-gray-600">
            <Link
              to="/chatbot"
              onClick={closeMenu}
              className={`hover:text-green-600 transition-all py-2 ${
                location.pathname === "/chatbot"
                  ? "text-green-600 font-semibold"
                  : ""
              }`}
            >
              Chatbox
            </Link>
            <Link
              to="/compiler"
              onClick={closeMenu}
              className={`hover:text-purple-600 transition-all py-2 ${
                location.pathname === "/compiler"
                  ? "text-purple-600 font-semibold"
                  : ""
              }`}
            >
              Compiler
            </Link>
            <Link
              to="/collab"
              onClick={closeMenu}
              className={`hover:text-blue-600 transition-all py-2 ${
                location.pathname === "/collab"
                  ? "text-blue-600 font-semibold"
                  : ""
              }`}
            >
              Collaborate
            </Link>
            <Link
              to="/submit-query"
              onClick={closeMenu}
              className={`hover:text-red-600 transition-all py-2 ${
                location.pathname === "/submit-query"
                  ? "text-red-600 font-semibold"
                  : ""
              }`}
            >
              Submit Query
            </Link>
            {user && (
              <>
                <a
                  onClick={() => {
                    becomeEducator();
                    closeMenu();
                  }}
                  className={`cursor-pointer hover:text-cyan-600 transition-all py-2 ${
                    location.pathname === "/educator"
                      ? "text-cyan-600 font-semibold"
                      : ""
                  }`}
                >
                  {isEducator ? "Educator Dashboard" : "Become Educator"}
                </a>
                <Link
                  to="/my-enrollments"
                  onClick={closeMenu}
                  className={`hover:text-cyan-600 transition-all py-2 ${
                    location.pathname === "/my-enrollments"
                      ? "text-cyan-600 font-semibold"
                      : ""
                  }`}
                >
                  My Enrollments
                </Link>
              </>
            )}
            {!user && (
              <a
                onClick={() => {
                  openSignIn();
                  closeMenu();
                }}
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all text-center hover:shadow-md active:scale-95"
              >
                Create Account
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
