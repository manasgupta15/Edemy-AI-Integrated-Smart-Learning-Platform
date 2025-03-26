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
    // Method 1: Check for Clerk session (development)
    if (req.auth?.userId) {
      const user = await clerkClient.users.getUser(req.auth.userId);
      req.user = {
        id: req.auth.userId,
        fullName: `${user.firstName} ${user.lastName}`.trim() || "Anonymous",
      };
      return next();
    }

    // Method 2: Check Authorization header (production)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = await clerkClient.verifyToken(token);
      const user = await clerkClient.users.getUser(decoded.sub);

      req.user = {
        id: decoded.sub,
        fullName: `${user.firstName} ${user.lastName}`.trim() || "Anonymous",
      };
      return next();
    }

    // If neither method worked
    return res.status(401).json({ success: false, message: "Unauthorized" });
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Authentication failed" });
  }
};
