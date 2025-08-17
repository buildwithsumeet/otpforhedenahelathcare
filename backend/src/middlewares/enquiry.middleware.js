import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const enquiryMiddleware = asyncHandler(async (req, res, next) => {
  console.log("Verifying JWT for user......");

  // Debug the environment variable - make sure it's loaded
  console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRECT);
  console.log("NODE_ENV:", process.env.NODE_ENV);

  try {
    // Retrieve token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("Token received:", token); // Debug token presence

    if (!token) {
      throw new ApiError(401, "Unauthorized request - Token missing");
    }

    // Make sure the secret key is provided
    if (!process.env.ACCESS_TOKEN_SECRECT) {
      throw new ApiError(500, "ACCESS_TOKEN_SECRET is not configured");
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT);
    console.log("Decoded token:", decoded);

    // Find the user by decoded id (adjust field name as per your token payload)
    const userDetails = await User.findById(decoded._id).select("-password");

    if (!userDetails) {
      throw new ApiError(404, "Invalid access token - User not found");
    }

    // Attach user object to req for downstream use
    req.user = userDetails;

  } catch (error) {
    // Check if the token expired
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    }
    return next(new ApiError(401, error.message || "Invalid access token"));
  }

  // Check if the user has the required role for enquiry operations
  const { role } = req.user;
  if (!role || role !== "admin") {
    console.log("User role:", role); // Debug user role
    console.log("Access denied - Insufficient permissions for enquiry operations");
    
    // If the user does not have the required role, throw an error
    throw new ApiError(403, "Access denied - Insufficient permissions for enquiry operations");
  }

  // If the user has the required role, proceed to the next middleware/controller
  next();
});
  


export  {enquiryMiddleware};