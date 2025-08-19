// src/controllers/user.controller.js

import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import {User} from '../models/User.js';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const IST = "Asia/Kolkata";

const generateAccessTokenANDRefreshToken = async (user) => {
  try {
    const foundUser = await User.findById(user._id);
    
    if (!foundUser) {
      throw new ApiError(404, "User not found");
    }
    
    const accessToken = foundUser.generateAuthToken();
    const refreshToken = foundUser.generateAccessToken();
    
    // If you need to save the refresh token to the user document
    foundUser.refreshToken = refreshToken;
    await foundUser.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Internal server error"); 
  }
};
  

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phonenumber, anniversary, dob } = req.body || {};

  // Validate mandatory fields
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // Check duplicates
  const alreadyExists = await User.findOne({ email: email.trim().toLowerCase() });
  if (alreadyExists) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }

  // Handle avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "At least one image avatar is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // Create user (with safe defaults)
  const user = await User.create({
    name: name?.trim() || email.split("@")[0], // fallback if name missing
    email: email.trim().toLowerCase(),
    password,
    phonenumber: phonenumber?.trim() || null,
    anniversary,
    dob,
    avatar: avatar.url,
  });

  if (!user) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully!", { user }));
});



const loginUser = asyncHandler(async (req, res) => {
 const { email, password } = req.body 
 console.log('RAW req.body:', req.body); // For debugging
 if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({ email: email.trim().toLowerCase() })
    
  if(!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordMatch(password); // Assuming you have a method to compare passwords

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
 
const {accessToken,refreshToken} = await generateAccessTokenANDRefreshToken(user)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

const options = {
    httpOnly: true, 
     secure: process.env.NODE_ENV === 'production',

}
return res.status(200).cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(new ApiResponse(200, {
  user: loggedInUser, accessToken, refreshToken
}, {
  message: "Login successful"
}));
  
  


});
const logoutUser = asyncHandler(async (req, res) => {

  console.log("User logging out:", req.user);
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: null
    }
  }, { new: true, runValidators: true });

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
//  console.log("Refreshing access token for user......");
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
// console.log("Incoming refresh token:", incomingRefreshToken);
// console.log("Cookies:", req.cookies);
// console.log("process.env.REFRESH_TOKEN_SECRECT:", process.env.REFRESH_TOKEN_SECRECT);

if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRECT)
// console.log("Decoded token:", decodedToken);
const user = await User.findById(decodedToken?._id)

if (!user) {
    throw new ApiError(404, "User not found");
  }

  if(incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

const options = {
    httpOnly: true,
     secure: process.env.NODE_ENV === 'production',
  };

  const {accessToken, newRefreshToken} =await generateAccessTokenANDRefreshToken(user)

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(new ApiResponse(200, {accessToken,newRefreshToken}, "Access token refreshed successfully"));

})
const changeCurrentPassword= asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordMatch = await user.isPasswordMatch(currentPassword);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save({validateBeforeSave: false});
  return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

const currentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.json(new ApiResponse(200, user, "Current user fetched successfully")); 
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name?.trim() || !email?.trim()) {
    throw new ApiError(400, "Name and email are required");
  }

  const user = await User.findByIdAndUpdate(
  req.user?._id,
  {
    $set: {
      name: name.trim(),
      email: email.trim().toLowerCase()
    }
  },
  { new: true }
).select("-password -refreshToken");

  


 

  return res.json(new ApiResponse(200, user, "Account details updated successfully"));
});

const showAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");

  res.status(200).json(
    new ApiResponse(200, users, "Users fetched successfully")
  );
});

const editUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, isActive } = req.body;

  if (!userId) throw new ApiError(400, "User ID is required");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (name) user.name = name?.trim();
  if (email) user.email = email?.trim().toLowerCase();
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(userId).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
});


// const softDeleteUser = asyncHandler(async (req, res) => {
//   const { userId } = req.params;
//   await User.findByIdAndUpdate(userId, {
//     $set: { isActive: false }
//   });
//   return res.status(200).json(new ApiResponse(200, null, "User marked as inactive"));
// });


const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  await User.findByIdAndDelete(userId);
  return res.status(200).json(new ApiResponse(200, null, "User deleted permanently"));
});


const setActiveStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body || {};

  if (typeof isActive !== 'boolean') {
    throw new ApiError(400, "isActive must be true or false");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { isActive } },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, `User ${isActive ? "activated" : "deactivated"} successfully`));
});


// sign up with google or facebook
// You can implement this function to handle OAuth signups
// For now, we will just return a success message
const socialSignup = asyncHandler(async (req, res) => {
  const { name, email, avatar } = req.body ;
  if (!name || !email || !avatar) {
    throw new ApiError(400, "Name, email, and avatar are required");
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.trim().toLowerCase()
  });
  if (existingUser) {
    return res.status(400).json(new ApiResponse(400, null, "User already exists with this email"));
  }
  // Create new user
  const user = await User.create({ name, email, avatar });
  if (!user) {
    throw new ApiError(500, "User registration failed");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

const socialLogin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  // Check if user exists
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessTokenANDRefreshToken(user);
  // Update refresh token in user document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  // Return response
  return res
    .status(200)
    .cookie("accessToken", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    .cookie("refreshToken", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
    .json(new ApiResponse(200, {
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
      accessToken,
      refreshToken
    }, "Social login successful"));
});

const getTodayEvents = async (req, res) => {
  try {
    // Force IST timezone
    const today = dayjs().tz("Asia/Kolkata").startOf("day");
    console.log("👉 Today (IST):", today.format("DD/MM/YYYY HH:mm"));

    const users = await User.find({ isDeleted: false, isActive: true });
    const todayEvents = [];

    users.forEach((user) => {
      // 🎂 Birthday check
      if (user.dob) {
        const dob = dayjs(user.dob, "DD/MM/YYYY").year(today.year());
        if (dob.isValid() && dob.isSame(today, "day")) {
          todayEvents.push({
            type: "birthday",
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            date: dob.format("DD/MM/YYYY"),
          });
        }
      }

      // 💍 Anniversary check
      if (user.anniversary) {
        const ann = dayjs(user.anniversary, "DD/MM/YYYY").year(today.year());
        if (ann.isValid() && ann.isSame(today, "day")) {
          todayEvents.push({
            type: "anniversary",
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            date: ann.format("DD/MM/YYYY"),
          });
        }
      }
    });

    res.json({
      success: true,
      total: todayEvents.length,
      todayEvents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API 2: Upcoming 7 Days (excluding today)
const getUpcomingEvents = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false, isActive: true });
    console.log("Fetched users for upcoming events:", users.map(u => u.name));

    const today = dayjs().tz(IST).startOf("day");        // today IST
    const next7Days = today.add(7, "day").endOf("day");  // 7-day window
    const upcomingEvents = [];

    // helper to compute next occurrence of DOB/Anniversary
    const getNextOccurrence = (dateStr) => {
      let d = dayjs(dateStr, "DD/MM/YYYY");
      if (!d.isValid()) return null;

      let occurrence = d.year(today.year()).tz(IST);

      // if event already passed this year → move to next year
      if (occurrence.isBefore(today, "day")) {
        occurrence = occurrence.add(1, "year");
      }

      return occurrence;
    };

    users.forEach((user) => {
      // 🎂 Birthday check
      if (user.dob) {
        const dob = getNextOccurrence(user.dob);
        if (dob && dob.isAfter(today, "day") && dob.isSameOrBefore(next7Days)) {
          upcomingEvents.push({
            type: "birthday",
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            date: dob.format("DD/MM/YYYY"),
          });
        }
      }

      // 💍 Anniversary check
      if (user.anniversary) {
        const ann = getNextOccurrence(user.anniversary);
        if (ann && ann.isAfter(today, "day") && ann.isSameOrBefore(next7Days)) {
          upcomingEvents.push({
            type: "anniversary",
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            date: ann.format("DD/MM/YYYY"),
          });
        }
      }
    });

    // Sort by upcoming date
    upcomingEvents.sort((a, b) =>
      dayjs(a.date, "DD/MM/YYYY").diff(dayjs(b.date, "DD/MM/YYYY"))
    );

    res.json({ success: true, total: upcomingEvents.length, upcomingEvents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, logoutUser, refreshAccessToken,updateAccountDetails, changeCurrentPassword, currentUser, showAllUsers, deleteUser, setActiveStatus,editUser, socialSignup, socialLogin, getTodayEvents, getUpcomingEvents };
