import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [certificateUrl, setCertificateUrl] = useState(""); // Store generated certificate URL

  // Fetch the selected course data
  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.forEach((item) => {
          if (item.userId === userData?._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Fetch progress data from API
  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData || { lectureCompleted: [] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Mark lecture as completed
  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);

        // Update progress state locally
        setProgressData((prev) => ({
          ...prev,
          lectureCompleted: [...(prev?.lectureCompleted || []), lectureId],
        }));

        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle Rating
  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (courseId) {
      getCourseProgress();
    }
  }, [courseId]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  useEffect(() => {
    if (courseData?.courseThumbnail) {
      setThumbnailUrl(
        `${backendUrl}/api/educator/thumbnail/${courseData.courseThumbnail}`
      );
    }
  }, [courseData, backendUrl]);

  useEffect(() => {
    const checkExistingCertificate = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(
          `${backendUrl}/api/certificates/check-certificate/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success && data.certificateUrl) {
          setCertificateUrl(data.certificateUrl);
        }
      } catch (error) {
        console.error("Error checking certificate:", error);
      }
    };

    if (courseId && userData?._id) {
      checkExistingCertificate();
    }
  }, [courseId, userData?._id, getToken, backendUrl]);

  const handleLectureClick = (lecture) => {
    // Ensure that the lecture URL exists and set playerData
    if (lecture?.lectureUrl) {
      const videoId = lecture.lectureUrl.split("/").pop(); // Extract video ID from the URL
      setPlayerData({
        ...lecture,
        videoId, // Store the videoId to be used in YouTube player
      });
    } else {
      toast.error("Lecture video is not available.");
    }
  };

  // Generate Certificate
  // const handleGenerateCertificate = async () => {
  //   try {
  //     const token = await getToken();
  //     const { data } = await axios.get(
  //       `${backendUrl}/api/certificates/generate-certificate/${courseId}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (data.success) {
  //       toast.success("Certificate generated successfully!");
  //       window.open(data.certificateUrl, "_blank"); // Open the certificate URL in a new tab
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  const handleGenerateCertificate = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backendUrl}/api/certificates/generate-certificate/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000, // 30 second timeout
        }
      );

      if (data.success) {
        toast.success(data.message || "Certificate generated successfully!");
        setCertificateUrl(data.certificateUrl);
      } else {
        toast.error(data.error || "Failed to generate certificate");
      }
    } catch (error) {
      console.error("Certificate error:", error);
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to generate certificate"
      );
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      if (!certificateUrl) {
        toast.error("No certificate available to download");
        return;
      }

      const token = await getToken();
      const filename = certificateUrl.split("/").pop();

      // Create a hidden anchor tag
      const link = document.createElement("a");
      link.href = `${backendUrl}/api/certificates/download/${filename}`;
      link.setAttribute("download", "certificate.pdf");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");

      // Add authorization header through fetch
      const response = await fetch(link.href, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      link.href = blobUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download certificate. Please try again.");
    }
  };

  const isCourseCompleted =
    courseData &&
    progressData &&
    progressData.lectureCompleted.length ===
      courseData.courseContent.reduce(
        (total, chapter) => total + chapter.chapterContent.length,
        0
      );

  return courseData && progressData ? (
    <>
      <div className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Course Structure
          </h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-gray-300 bg-white mb-2 rounded"
              >
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(index)}
                >
                  <p className="font-medium md:text-base text-sm">
                    {chapter.chapterTitle}
                  </p>
                </div>
                <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                  {chapter.chapterContent.map((lecture, i) => (
                    <li key={i} className="flex items-start gap-2 py-1">
                      <img
                        src={
                          progressData?.lectureCompleted?.includes(
                            lecture.lectureId
                          )
                            ? assets.blue_tick_icon
                            : assets.play_icon
                        }
                        alt="play-icon"
                        className="w-4 h-4 mt-1"
                      />
                      <div className="flex items-center justify-between w-full text-gray-800 text-xs md:default-text">
                        <p>{lecture.lectureTitle}</p>
                        <div className="flex gap-2">
                          {lecture.lectureUrl && (
                            <p
                              onClick={() => handleLectureClick(lecture)}
                              className="text-blue-500 cursor-pointer"
                            >
                              Watch
                            </p>
                          )}
                          <p>
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["h", "m"] }
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certificate Button */}
          {/* <div className="mt-5">
            <button
              onClick={handleGenerateCertificate}
              className={`px-4 py-2 text-white font-bold rounded ${
                isCourseCompleted
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isCourseCompleted}
            >
              {isCourseCompleted
                ? "Get Certificate"
                : "Complete Course to Unlock Certificate"}
            </button>
          </div> */}

          <div className="mt-5 flex gap-4">
            {/* Generate Certificate Button - Only show if certificate doesn't exist */}
            {!certificateUrl && (
              <button
                onClick={handleGenerateCertificate}
                className={`px-4 py-2 text-white font-bold rounded ${
                  isCourseCompleted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isCourseCompleted}
              >
                {isCourseCompleted
                  ? "Get Certificate"
                  : "Complete Course to Unlock Certificate"}
              </button>
            )}

            {/* Download Certificate Button - Shows if certificate exists */}
            {certificateUrl && (
              <button
                onClick={handleDownloadCertificate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
              >
                Download Certificate
              </button>
            )}
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>
        </div>

        {/* Right Column - Video Player */}
        <div className="md:mt-10">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.videoId} // Using the videoId from playerData
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-1">
                <p>
                  {playerData.chapter}·{playerData.lecture}{" "}
                  {playerData.lectureTitle}
                </p>
                <button
                  onClick={() => markLectureAsCompleted(playerData.lectureId)}
                  className="text-blue-600 cursor-pointer"
                >
                  {progressData?.lectureCompleted?.includes(
                    playerData.lectureId
                  )
                    ? "Completed"
                    : "Mark Complete"}
                </button>
              </div>
            </div>
          ) : (
            // <img src={courseData.courseThumbnail} alt="Course Thumbnail" />
            <img
              src={thumbnailUrl || assets.placeholder_image}
              alt={courseData.courseTitle}
              onError={(e) => {
                e.target.src = assets.placeholder_image;
              }}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Player;
