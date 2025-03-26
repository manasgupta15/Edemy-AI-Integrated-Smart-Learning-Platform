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
    // Try to get from Authorization header first (for production)
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const decoded = await clerkClient.verifyToken(token);
        if (decoded) {
          const user = await clerkClient.users.getUser(decoded.sub);
          req.user = {
            id: decoded.sub,
            email: user.emailAddresses?.[0]?.emailAddress || "",
            fullName:
              [user.firstName, user.lastName].filter(Boolean).join(" ") ||
              "Unknown",
            role: user.publicMetadata?.role || "student",
          };
          return next();
        }
      }
    }

    // Fallback to Clerk session (for development)
    const userId = req.auth?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const user = await clerkClient.users.getUser(userId);
    req.user = {
      id: userId,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      fullName:
        [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown",
      role: user.publicMetadata?.role || "student",
    };

    next();
  } catch (error) {
    console.error("Error in extractUser:", error);
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};
