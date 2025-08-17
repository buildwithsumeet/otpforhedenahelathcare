import asyncHandler from "../utils/asyncHandler.js";

const roleAccessController = asyncHandler(async (req, res, next) => {
  const user = req.user; // Assuming user is attached to req by auth middleware

  if (!user) {
    return res.status(403).json({
      success: false,
      message: "Access denied. User not authenticated.",
    });
  }

  // Check if the user has the required role
if (user.role !== "admin" && user.role !== "superadmin") {
  return res.status(403).json({
    success: false,
    message: "Access denied. Insufficient permissions.",
  });
}


  // If user has the required role, proceed to the next middleware/controller
  next();
});

export  {roleAccessController};