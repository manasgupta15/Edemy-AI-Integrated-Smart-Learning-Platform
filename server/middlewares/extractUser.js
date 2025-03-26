import { clerkClient } from "@clerk/express";

export const extractUser = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    console.log("🔍 Extracted User ID:", userId);

    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Ensure firstName & lastName exist
    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown";

    req.user = {
      id: userId,
      email: user.emailAddresses?.[0]?.emailAddress || "",
      fullName, // Safely extracted full name
      role: user.publicMetadata?.role || "student", // Default role
    };

    next();
  } catch (error) {
    console.error(
      "❌ Error in extractUser middleware:",
      error.message || error
    );
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};
