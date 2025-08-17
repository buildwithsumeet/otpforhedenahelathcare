// ✅ This is correct

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"; // ← Make sure this path is correct

const connectDB = async () => {
  try {
    const connection = await mongoose.mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    console.log("✅ Connected to MongoDB:", connection.connection.name);
    console.log(connection.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}; 

export default connectDB;
