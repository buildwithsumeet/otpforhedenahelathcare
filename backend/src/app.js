import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Import cron job to start it
import "./cron/otpCron.js";

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

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

console.log("User routes loaded successfully2");

// Enquiry Route (MUST be added ABOVE userRouter as you requested)
// import enquiryRouter from "./routes/enquiry.routes.js";
// app.use("/api/v1/enquiry", enquiryRouter);

// // User Routes
// import userRouter from "./routes/user.routes.js";
// app.use("/api/v1/users", userRouter);

// // Front Page Routes
// import pageRouter from "./routes/frontPage.routes.js";
// app.use("/api/v1/front-page", pageRouter);

// import eventImportantDayRouter from "./routes/eventImportantDay.routes.js";
// app.use("/api/v1/events", eventImportantDayRouter);

import otpRouter from "./routes/otpRoutes.js"
app.use("/api/v1/otpRouter", otpRouter)

import paymentRouter from "./routes/payment.routes.js"
app.use("/api/v1/payment", paymentRouter)

import bitrixRouter from "./routes/bitrix.routes.js"
app.use("/api/v1/paymentFrontendSendLink" ,bitrixRouter )

export default app;
