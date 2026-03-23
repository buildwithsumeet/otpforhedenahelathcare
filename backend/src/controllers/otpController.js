import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js";

// 1️⃣ Bitrix sends BOTH deal_id and booking_id to trigger Start OTP
export const bookingCreated = asyncHandler(async (req, res) => {
  // Security Check
  if (req.body.auth?.application_token !== "1keq4jkmzxaw9pfjeqnp5mieb35jnilk") {
    throw new ApiError(403, "Unauthorized");
  }

  // Bitrix usually sends these in FIELDS or root data
  const data = req.body.data?.FIELDS || req.body.data;
  const deal_id = Number(data?.DEAL_ID || data?.ID); 
  const booking_id = Number(data?.BOOKING_ID || data?.UF_BOOKING_ID); // Ensure your Bitrix webhook sends this

  if (!deal_id || !booking_id) {
    throw new ApiError(400, "Both deal_id and booking_id are required from Bitrix");
  }

  const startOTP = generateOTP();

  // 🔥 Find existing record by deal_id (from payment) and link booking_id
  const booking = await Booking.findOneAndUpdate(
    { deal_id: deal_id },
    { 
      booking_id: booking_id, 
      start_otp: startOTP, 
      status: "pending" 
    },
    { upsert: true, new: true }
  );

  // Sync Start OTP back to Bitrix using deal_id
  await axios.post(`https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json`, {
    ID: deal_id,
    fields: {
      UF_CRM_1773128404473: startOTP, // Your Start OTP field
      COMMENTS: `🔢 Start OTP generated for Booking ID: ${booking_id}`
    }
  });

  return res.json(new ApiResponse(200, { booking_id, deal_id, startOTP }, "IDs linked and OTP synced"));
});

// 2️⃣ Technician verifies Start OTP using booking_id
export const verifyStartOTP = asyncHandler(async (req, res) => {

  console.log(req.body)
  const { booking_id, otp } = req.body;

  // App Security Token
  if (req.body?.auth?.application_token !== "1mg3n9w7edjll06yxilumza1z3l5qrjz") {
    throw new ApiError(403, "Unauthorized");
  }

  // Find by booking_id
  const booking = await Booking.findOne({ booking_id: Number(booking_id) });
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.start_otp !== otp) throw new ApiError(401, "Invalid OTP");
  
  if (booking.status === "started") return res.json(new ApiResponse(200, {}, "Already started"));

  // Update for Cron to pick up
  booking.status = "started";
  booking.start_time = new Date();
  booking.completion_otp_generated = false; 
  await booking.save();

  // Update Bitrix via deal_id
  try {
    await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
      ID: booking.deal_id,
      fields: {
        COMMENTS: "✅ Service Started. Completion OTP will be generated in 10 mins."
      }
    });
  } catch (err) {
    console.log("❌ Bitrix error:", err.response?.data || err.message);
  }

  return res.json(new ApiResponse(200, {}, "Service started"));
});

// 3️⃣ Verify Completion OTP using booking_id
export const verifyCompletionOTP = asyncHandler(async (req, res) => {
  const { booking_id, otp } = req.body;

  // App Security Token
  if (req.body?.auth?.application_token !== "n0mak7pbxpk2ef0dk0wx9rtpqum76d7j") {
    throw new ApiError(403, "Unauthorized");
  }

  const booking = await Booking.findOne({ booking_id: Number(booking_id) });
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.completion_otp !== otp) throw new ApiError(401, "Invalid Completion OTP");

  booking.status = "completed";
  booking.end_time = new Date();
  await booking.save();

  // Close Bitrix Deal via deal_id
  try {
    await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
      ID: booking.deal_id,
      fields: {
        STAGE_ID: "C1:WON",
        COMMENTS: "🏁 Service Completed Successfully"
      }
    });
  } catch (err) {
    console.log("❌ Bitrix error:", err.response?.data || err.message);
  }

  return res.json(new ApiResponse(200, {}, "Work completed"));
});
