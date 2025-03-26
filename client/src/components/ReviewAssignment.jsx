import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ReviewAssignment = () => {
  const { backendUrl } = useContext(AppContext);
  const { assignmentId } = useParams(); // Get the assignmentId from the URL
  const [assignment, setAssignment] = useState(null);
  const [status, setStatus] = useState(""); // "Reviewed" or "Pending"
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch assignment details
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/assignments/single/${assignmentId}`
        );
        setAssignment(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching assignment details");
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [assignmentId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${backendUrl}/api/assignments/review/${assignmentId}`,
        {
          status,
          feedback,
          score,
        }
      );
      alert("Assignment reviewed successfully!");
      // Redirect to the view assignment page with the assignmentId
      navigate(`/educator/assignments/view/${assignmentId}`);
    } catch (err) {
      setError("Error submitting the review");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Inline styles
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "'Arial', sans-serif",
    },
    heading: {
      fontSize: "2em",
      marginBottom: "20px",
    },
    assignmentDetails: {
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "#f8f8f8",
      borderRadius: "8px",
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      marginBottom: "15px",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      marginBottom: "15px",
      height: "150px",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Review Assignment</h2>
      <div style={styles.assignmentDetails}>
        <p>
          <strong>Student Name:</strong> {assignment.name}
        </p>
        <p>
          <strong>Course:</strong> {assignment.courseId.courseTitle}
        </p>
        <p>
          <strong>Submitted File:</strong>{" "}
          <a
            href={assignment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View File
          </a>
        </p>
        <p>
          <strong>Email:</strong> {assignment.email}
        </p>
      </div>
      <form onSubmit={handleReviewSubmit}>
        <div>
          <label style={styles.label}>Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Feedback:</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="4"
            placeholder="Provide feedback..."
            style={styles.textarea}
          />
        </div>

        <div>
          <label style={styles.label}>Score (0-100):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewAssignment;
