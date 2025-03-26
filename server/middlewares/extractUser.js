// import { clerkClient } from "@clerk/express";

// export const extractUser = async (req, res, next) => {
//   try {
//     const userId = req.auth?.userId;

//     if (!userId) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Not authorized" });
//     }

//     console.log("🔍 Extracted User ID:", userId);

//     // Fetch user details from Clerk
//     const user = await clerkClient.users.getUser(userId);

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     // Ensure firstName & lastName exist
//     const fullName =
//       [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown";

//     req.user = {
//       id: userId,
//       email: user.emailAddresses?.[0]?.emailAddress || "",
//       fullName, // Safely extracted full name
//       role: user.publicMetadata?.role || "student", // Default role
//     };

//     next();
//   } catch (error) {
//     console.error(
//       "❌ Error in extractUser middleware:",
//       error.message || error
//     );
//     res.status(500).json({ success: false, message: "Authentication error" });
//   }
// };

import { clerkClient } from "@clerk/express";

export const extractUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No authorization token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Clerk automatically verifies the token in the middleware
    // So we can trust req.auth.userId if we got here
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Get basic user info (simplified version)
    const user = await clerkClient.users.getUser(userId);

    req.user = {
      id: userId,
      fullName:
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        "Anonymous",
      email: user.emailAddresses[0]?.emailAddress || "",
      role: user.publicMetadata?.role || "student",
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
