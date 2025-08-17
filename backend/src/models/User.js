// models/User.js

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  avatar: {
    type: String,
    trim: true, // Optional field, can be empty
  },
phonenumber: {
  type: String,
  unique: true,
  sparse: true,   // <---- Important: allows multiple documents without this field
  required: true, // or enforce that it must exist
},
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
 
anniversary: {
    type: String,
    trim: true, // Optional field, can be empty
  },
  dob: {
    type: String,
    trim: true, // Optional field, can be empty
  },
  isActive: {
    type: Boolean,
    default: true, // Default to active
  },
  isDeleted: {
    type: Boolean,
    default: false, // Default to not deleted
  }

},{timestamps: true});



// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare passwords
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      
    },
    process.env.ACCESS_TOKEN_SECRECT, // ✅ fixed typo
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      
    },
    process.env.REFRESH_TOKEN_SECRECT, // ✅ fixed typo
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
    }
  );
};

const User = mongoose.model("User", userSchema);

export { User };
