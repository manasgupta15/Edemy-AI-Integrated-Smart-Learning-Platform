// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AppContext } from "../../context/AppContext";
// import CourseCard from "./CourseCard";

// const CourseSection = () => {
//   const { allCourses } = useContext(AppContext);
//   return (
//     <div className="py-16 md:px-40 px-8">
//       <h2 className="text-3xl font-medium text-gray-800">
//         Learn from the best
//       </h2>
//       <p className="text-sm md:text-base text-gray-500 mt-3">
//         Discover our top-rated courses across various categories. From coding
//         and design to <br /> business and wellness, our courses are crafted to
//         deliver results
//       </p>

//       <div className="grid grid-auto-cols px-4 md:px-0 md:my-16 my-10 gap-4">
//         {allCourses.slice(0, 4).map((course, index) => (
//           <CourseCard key={index} course={course} />
//         ))}
//       </div>

//       <Link
//         to={"/course-list"}
//         onClick={() => scrollTo(0, 0)}
//         className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded"
//       >
//         Show all courses
//       </Link>
//     </div>
//   );
// };

// export default CourseSection;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 md:px-40 px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-3xl font-medium text-gray-800">
          Learn from the best
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-3">
          Discover our top-rated courses across various categories. From coding
          and design to <br /> business and wellness, our courses are crafted to
          deliver results
        </p>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {allCourses.slice(0, 3).map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </div>

        {/* Show All Courses Button */}
        <div className="mt-8 text-center">
          <Link
            to={"/course-list"}
            onClick={() => scrollTo(0, 0)}
            className="inline-block text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-100 transition-colors duration-300"
          >
            Show all courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseSection;
