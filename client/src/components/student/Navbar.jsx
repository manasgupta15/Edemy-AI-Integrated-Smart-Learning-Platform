// import { Link, useLocation } from "react-router-dom"; // ✅ Import useLocation
// import { assets } from "../../assets/assets";
// import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
// import { useContext } from "react";
// import { AppContext } from "../../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Navbar = () => {
//   const { navigate, isEducator, backendUrl, setIsEducator, getToken } =
//     useContext(AppContext);
//   const location = useLocation(); // ✅ Get the current location
//   const isCourseListPage = location.pathname.includes("/course-list"); // ✅ Now it works!

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
//       className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
//         isCourseListPage ? "bg-white" : "bg-cyan-100/70"
//       }`}
//     >
//       <img
//         onClick={() => navigate("/")}
//         src={assets.logo}
//         alt="Logo"
//         className="w-28 lg:w-32 cursor-pointer"
//       />

//       <div className="hidden md:flex items-center gap-5 text-gray-500">
//         {/* ✅ Chatbox Button */}
//         <button
//           onClick={() => navigate("/chatbot")}
//           className="relative bg-green-600/20 text-white px-5 py-2 rounded-full ml-4 backdrop-blur-md border border-green-600/30 hover:bg-green-600/30 hover:border-green-600/50 transition-all duration-300 shadow-lg shadow-green-600/10 hover:shadow-green-600/20 overflow-hidden"
//         >
//           <span className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-green-600/30 opacity-0 hover:opacity-100 transition-all duration-300"></span>
//           <span className="relative z-10 font-semibold">Chatbox</span>
//         </button>

//         {/* ✅ Compiler Button */}
//         <button
//           onClick={() => navigate("/compiler")}
//           className="relative bg-purple-600/20 text-white px-5 py-2 rounded-full ml-4 backdrop-blur-md border border-purple-600/30 hover:bg-purple-600/30 hover:border-purple-600/50 transition-all duration-300 shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 overflow-hidden"
//         >
//           <span className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-purple-600/30 opacity-0 hover:opacity-100 transition-all duration-300"></span>
//           <span className="relative z-10 font-semibold">Compiler</span>
//         </button>

//         <button
//           onClick={() => navigate("/collab")}
//           className="relative bg-blue-600/20 text-white px-5 py-2 rounded-full ml-4 backdrop-blur-md border border-blue-600/30 hover:bg-blue-600/30 hover:border-blue-600/50 transition-all duration-300 shadow-lg shadow-blue-600/10 hover:shadow-blue-600/20 overflow-hidden"
//         >
//           <span className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-blue-600/30 opacity-0 hover:opacity-100 transition-all duration-300"></span>
//           <span className="relative z-10 font-semibold">Collaborate</span>
//         </button>

//         {/* ✅ Submit Query Button */}
//         <button
//           onClick={() => navigate("/submit-query")}
//           className="relative bg-red-600/20 text-white px-5 py-2 rounded-full ml-4 backdrop-blur-md border border-red-600/30 hover:bg-red-600/30 hover:border-red-600/50 transition-all duration-300 shadow-lg shadow-red-600/10 hover:shadow-red-600/20 overflow-hidden"
//         >
//           <span className="relative z-10 font-semibold">Submit Query</span>
//         </button>
//         <div className="flex items-center gap-5">
//           {user && (
//             <>
//               <button className="cursor-pointer" onClick={becomeEducator}>
//                 {isEducator ? "Educator Dashboard" : "Become Educator"}
//               </button>
//               | <Link to="/my-enrollments"> My Enrollments</Link>
//             </>
//           )}
//         </div>

//         {user ? (
//           <UserButton />
//         ) : (
//           <button
//             onClick={() => openSignIn()}
//             className="bg-blue-600 text-white px-5 py-2 rounded-full"
//           >
//             Create Account
//           </button>
//         )}
//       </div>

//       {/* For Phone Screens */}
//       <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
//         {/* ✅ Compiler Button for Mobile */}
//         <button
//           onClick={() => navigate("/compiler")}
//           className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
//         >
//           Compiler
//         </button>

//         {/* ✅ Chatbox Button for Mobile */}
//         <button
//           onClick={() => navigate("/chatbot")}
//           className="bg-green-600 text-white px-3 py-1 rounded-full text-sm"
//         >
//           Chatbox
//         </button>

//         {/* ✅ Collaboration Button for Mobile */}
//         <button
//           onClick={() => navigate("/collab")}
//           className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
//         >
//           Collaborate
//         </button>

//         {/* ✅ Submit Query Button for Mobile */}
//         <button
//           onClick={() => navigate("/submit-query")}
//           className="bg-red-600 text-white px-3 py-1 rounded-full text-sm"
//         >
//           Submit Query
//         </button>
//         <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
//           {user && (
//             <>
//               <button className="cursor-pointer" onClick={becomeEducator}>
//                 {isEducator ? "Educator Dashboard" : "Become Educator"}
//               </button>
//               <Link to="/my-enrollments"> My Enrollments</Link>
//             </>
//           )}
//         </div>
//         {user ? (
//           <UserButton />
//         ) : (
//           <button onClick={() => openSignIn()} className="cursor-pointer">
//             <img src={assets.user_icon} alt="" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Navbar;

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

  const { openSignIn } = useClerk();
  const { user } = useUser();

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

  return (
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

      <div className="hidden md:flex items-center gap-4 text-gray-600 text-lg">
        <Link to="/chatbot" className="hover:text-green-600 transition-all">
          Chatbox
        </Link>
        <Link to="/compiler" className="hover:text-purple-600 transition-all">
          Compiler
        </Link>
        <Link to="/collab" className="hover:text-blue-600 transition-all">
          Collaborate
        </Link>
        <Link to="/submit-query" className="hover:text-red-600 transition-all">
          Submit Query
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <>
              <a
                onClick={becomeEducator}
                className="cursor-pointer hover:text-cyan-600 transition-all"
              >
                {isEducator ? "Educator Dashboard" : "Become Educator"}
              </a>{" "}
              <Link to="/my-enrollments" className="hover:text-cyan-600">
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
            className="cursor-pointer bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition-all"
          >
            Create Account
          </a>
        )}
      </div>

      {/* Mobile View */}
      <div className="md:hidden flex items-center gap-3 text-gray-600 text-xs">
        <Link to="/compiler" className="hover:text-purple-600">
          Compiler
        </Link>
        <Link to="/chatbot" className="hover:text-green-600">
          Chatbox
        </Link>
        <Link to="/collab" className="hover:text-blue-600">
          Collaborate
        </Link>
        <Link to="/submit-query" className="hover:text-red-600">
          Submit Query
        </Link>
        <div className="flex items-center gap-2">
          {user && (
            <>
              <a
                onClick={becomeEducator}
                className="cursor-pointer hover:text-cyan-600"
              >
                {isEducator ? "Educator" : "Become Educator"}
              </a>
              <Link to="/my-enrollments" className="hover:text-cyan-600">
                Enrollments
              </Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <a onClick={() => openSignIn()} className="cursor-pointer">
            <img src={assets.user_icon} alt="" className="w-6" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Navbar;
