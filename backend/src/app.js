import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware in this exact order
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
    "https://lets-connect-9s68-mwrwnuvvm-buildwithsumeets-projects.vercel.app"
  ].filter(Boolean), // removes undefined/null
  credentials: true,
}));


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
console.log("User routes loaded successfully2");
// Test route
// app.post("/test-simple", (req, res) => {
//   console.log("req.body:", req.body);
//   res.json({ body: req.body });
// });

// Enquiry Route (MUST be added ABOVE userRouter as you requested)
import enquiryRouter from "./routes/enquiry.routes.js";
app.use("/api/v1/enquiry", enquiryRouter);
// console.log("Enquiry routes loaded successfully....");
// Routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import pageRouter from "./routes/frontPage.routes.js";
app.use("/api/v1/front-page", pageRouter);
// console.log("Front page routes loaded successfully....");

// console.log("User routes loaded successfully....");

export default app;
