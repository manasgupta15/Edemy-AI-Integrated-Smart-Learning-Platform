import { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { currency, calculateRating, backendUrl } = useContext(AppContext);

  // Construct the thumbnail URL
  const thumbnailUrl = course.courseThumbnail
    ? `${backendUrl}/api/educator/thumbnail/${course.courseThumbnail}`
    : assets.placeholder_image; // Fallback if no thumbnail

  // Calculate rating once when component renders
  const currentRating = calculateRating(course);
  const fullStars = Math.floor(currentRating);
  const hasHalfStar = currentRating % 1 >= 0.5;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Course Thumbnail */}
      <img
        className="w-full h-48 object-cover"
        src={thumbnailUrl}
        alt={course.courseTitle}
        onError={(e) => {
          e.target.src = assets.placeholder_image; // Fallback if image fails to load
        }}
      />

      {/* Course Details */}
      <div className="p-4">
        {/* Course Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {course.courseTitle}
        </h3>

        {/* Educator Name */}
        <p className="text-sm text-gray-500 mb-3">
          {course.educator?.name || "Unknown Educator"}
        </p>

        {/* Rating, Price, and Total Ratings in One Line */}
        <div className="flex items-center justify-between mb-3">
          {/* Rating Section */}
          <div className="flex items-center space-x-2">
            {/* Average Rating */}
            <span className="text-sm font-medium text-gray-800">
              {currentRating.toFixed(1)}
            </span>

            {/* Star Rating */}
            {/* Star Rating */}
            <div className="flex ml-1">
              {[...Array(5)].map((_, i) => {
                if (i < fullStars) {
                  return (
                    <img
                      key={i}
                      src={assets.star}
                      alt="full star"
                      className="w-4 h-4"
                    />
                  );
                } else if (i === fullStars && hasHalfStar) {
                  return (
                    <img
                      key={i}
                      src={assets.star_half} // Make sure you have a half-star asset
                      alt="half star"
                      className="w-4 h-4"
                    />
                  );
                } else {
                  return (
                    <img
                      key={i}
                      src={assets.star_blank}
                      alt="empty star"
                      className="w-4 h-4"
                    />
                  );
                }
              })}
            </div>

            {/* Total Ratings */}
            <span className="text-xs text-gray-500 ml-1">
              ({course.courseRatings.length})
            </span>
          </div>

          {/* Price Section */}
          <p className="text-lg font-semibold text-gray-800">
            {currency}
            {(
              course.coursePrice -
              (course.discount * course.coursePrice) / 100
            ).toFixed(2)}
          </p>
        </div>

        {/* Read More Button */}
        <Link
          to={`/course/${course._id}`}
          onClick={() => window.scrollTo(0, 0)}
          className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Know More
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
