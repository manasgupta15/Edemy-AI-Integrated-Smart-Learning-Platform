import { clerkClient } from "@clerk/express";

// Middleware to protect all authenticated routes
export const protectAuth = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // ✅ Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Extract email safely
    const email =
      user.emailAddresses?.[0]?.emailAddress ||
      user.primaryEmailAddress?.emailAddress ||
      "";

    if (!email) {
      console.error("Error: No valid email found in user data.");
      return res.status(400).json({
        success: false,
        message: "User email is not available.",
      });
    }

    // ✅ Attach user details to request
    req.user = { id: userId, email };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ success: false, message: "Authentication error" });
  }
};

// Middleware to protect educator routes
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    // ✅ Fetch user details from Clerk
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Check educator role
    if (user.publicMetadata.role !== "educator") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Access" });
    }

    // ✅ Attach user details to request
    req.user = {
      id: userId,
      email: user.emailAddresses?.[0]?.emailAddress || "",
    };

    next();
  } catch (error) {
    console.error("Error in protectEducator:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
