// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react"; // ✅ Import Clerk's useUser hook

// const PaymentSuccess = () => {
//   const location = useLocation();
//   const { user, isSignedIn } = useUser(); // ✅ Retrieve user info from Clerk

//   const [courseId, setCourseId] = useState("");
//   const [userId, setUserId] = useState("");
//   const [isEnrolled, setIsEnrolled] = useState(false);

//   useEffect(() => {
//     console.log("Extracting data from URL and Clerk...");

//     // ✅ Extract courseId from URL
//     const params = new URLSearchParams(location.search);
//     const courseIdFromUrl = params.get("courseId");

//     if (courseIdFromUrl) {
//       setCourseId(courseIdFromUrl);
//       console.log("✅ Fetched courseId from URL:", courseIdFromUrl);
//     } else {
//       console.error("❌ courseId missing in URL!");
//     }

//     // ✅ Get userId directly from Clerk
//     if (isSignedIn && user) {
//       setUserId(user.id);
//       console.log("✅ Retrieved userId from Clerk:", user.id);
//     } else {
//       console.error("❌ User is not signed in or missing!");
//     }
//   }, [location, user, isSignedIn]);

//   //   const saveEnrollment = async () => {
//   //     if (!courseId || !userId) {
//   //       console.error("❌ Missing courseId or userId!");
//   //       alert("Error: Missing courseId or userId.");
//   //       return;
//   //     }

//   //     try {
//   //       console.log("Attempting to save enrollment...");
//   //       console.log("🔍 courseId:", courseId);
//   //       console.log("🔍 userId:", userId);

//   //       const response = await fetch(
//   //         "http://localhost:5000/api/payment/save-enrollment",
//   //         {
//   //           method: "POST",
//   //           headers: { "Content-Type": "application/json" },
//   //           body: JSON.stringify({ courseId, userId, amount: 50 }),
//   //         }
//   //       );

//   //       const data = await response.json();
//   //       console.log("📩 Server Response:", data);

//   //       if (response.ok) {
//   //         alert("✅ Enrollment saved successfully!");
//   //         setIsEnrolled(true);
//   //       } else {
//   //         alert(`⚠️ Error: ${data.message}`);
//   //       }
//   //     } catch (error) {
//   //       console.error("❌ Network error:", error);
//   //       alert("⚠️ Something went wrong!");
//   //     }
//   //   };
//   const saveEnrollment = async () => {
//     if (!courseId || !userId) {
//       console.error("❌ Missing courseId or userId!");
//       alert("Error: Missing courseId or userId.");
//       return;
//     }

//     try {
//       console.log("Attempting to save enrollment...");
//       console.log("🔍 courseId:", courseId);
//       console.log("🔍 userId:", userId);

//       const response = await fetch(
//         "http://localhost:5000/api/payment/save-enrollment",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ courseId, userId, amount: 50 }),
//         }
//       );

//       const data = await response.json();
//       console.log("📩 Server Response:", data);

//       if (response.ok) {
//         alert("✅ Enrollment saved successfully!");
//         setIsEnrolled(true);
//       } else {
//         console.error("❌ Error saving enrollment:", data.message);
//         alert(`⚠️ Error: ${data.message}`);
//       }
//     } catch (error) {
//       console.error("❌ Network error:", error);
//       alert("⚠️ Something went wrong!");
//     }
//   };

//   return (
//     <div>
//       <h1>Payment Successful</h1>
//       <p>Thank you for enrolling!</p>
//       <button onClick={saveEnrollment} disabled={isEnrolled}>
//         {isEnrolled ? "Already Enrolled" : "Save Enrollment"}
//       </button>
//     </div>
//   );
// };

// export default PaymentSuccess;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const { user, isSignedIn } = useUser();

  const [courseId, setCourseId] = useState("");
  const [userId, setUserId] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    console.log("Extracting data from URL and Clerk...");

    const params = new URLSearchParams(location.search);
    const courseIdFromUrl = params.get("courseId");

    if (courseIdFromUrl) {
      setCourseId(courseIdFromUrl);
      console.log("✅ Fetched courseId from URL:", courseIdFromUrl);
    } else {
      console.error("❌ courseId missing in URL!");
    }

    if (isSignedIn && user) {
      setUserId(user.id);
      console.log("✅ Retrieved userId from Clerk:", user.id);
    } else {
      console.error("❌ User is not signed in or missing!");
    }
  }, [location, user, isSignedIn]);

  const saveEnrollment = async () => {
    if (!courseId || !userId) {
      console.error("❌ Missing courseId or userId!");
      alert("Error: Missing courseId or userId.");
      return;
    }

    try {
      console.log("Attempting to save enrollment...");
      console.log("🔍 courseId:", courseId);
      console.log("🔍 userId:", userId);

      const response = await fetch(
        "http://localhost:5000/api/payment/save-enrollment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, userId, amount: 50 }),
        }
      );

      const data = await response.json();
      console.log("📩 Server Response:", data);

      if (response.ok) {
        alert("✅ Enrollment saved successfully!");
        setIsEnrolled(true);
      } else {
        console.error("❌ Error saving enrollment:", data.message);
        alert(`⚠️ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("⚠️ Something went wrong!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Payment Successful</h1>
        <p style={styles.message}>Thank you for enrolling!</p>
        <button
          onClick={saveEnrollment}
          disabled={isEnrolled}
          style={isEnrolled ? styles.disabledButton : styles.button}
        >
          {isEnrolled ? "Already Enrolled" : "Save Enrollment"}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

// Modern Glassmorphism Styling
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  title: {
    fontSize: "2.5rem",
    color: "#333",
    marginBottom: "20px",
  },
  message: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "30px",
  },
  button: {
    background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  disabledButton: {
    background: "#ccc",
    color: "#666",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    fontSize: "1rem",
    cursor: "not-allowed",
  },
};
