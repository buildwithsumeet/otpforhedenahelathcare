import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import app from "./app.js";
import connectDB from "./db/db.js";

// app.get("/", (req, res) => {
//   res.send("Welcome to the Taskji API");
// });

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to the database:", err);
  });
