import { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);
  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    { name: "Add Course", path: "/educator/add-course", icon: assets.add_icon },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: "/educator/students-enrolled",
      icon: assets.person_tick_icon,
    },
    {
      name: "Create Quiz", // ✅ Added Create Quiz
      path: "/educator/add-quiz",
      icon: assets.quiz_icon, // ✅ Make sure you have an appropriate icon in assets
    },
    {
      name: "View Queries", // ✅ Added Educator Queries
      path: "/educator/queries",
      icon: assets.query_icon, // ✅ Make sure to add a query icon in assets
    },
    {
      name: "My Blogs", // New menu item
      path: "/educator/blogs",
      icon: assets.blog_icon, // Add a blog icon in your assets
    },
    // We’ll remove the dynamic course._id path here, and handle it separately
  ];

  return (
    isEducator && (
      <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
        {menuItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/educator"}
            className={({ isActive }) =>
              `flex items-center md:flex-row flex-col md:justify-center py-3.5 md:px-10 gap-3 ${
                isActive
                  ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                  : "hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90"
              }`
            }
          >
            <img src={item.icon} alt="" className="w-6 h-6" />
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        ))}
      </div>
    )
  );
};

export default Sidebar;
