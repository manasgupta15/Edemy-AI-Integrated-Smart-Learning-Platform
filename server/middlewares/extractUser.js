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

import { clerkClient } from "@clerk/clerk-sdk-node"; // Correct import for backend usage

export const extractUser = async (req, res, next) => {
  try {
    console.log("🔍 Extracting user information...");

    const userId = req.auth?.userId;

    if (!userId) {
      console.error("❌ No user ID found in request");
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    console.log("🔍 Extracted User ID:", userId);

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      console.error("❌ User not found in Clerk");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Safely extract user details
    req.user = {
      id: userId,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      fullName:
        [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown",
      role: user.publicMetadata?.role || "student",
    };

    console.log("✅ User extracted successfully:", req.user);
    next();
  } catch (error) {
    console.error("❌ Error in extractUser middleware:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      message: "Authentication error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
