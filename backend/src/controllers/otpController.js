import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js";

// 1️⃣ Booking Created
export const bookingCreated = asyncHandler(async (req, res) => {
  if (req.body.auth?.application_token !== "1keq4jkmzxaw9pfjeqnp5mieb35jnilk") {
    throw new ApiError(403, "Unauthorized");
  }

  console.log()

  const data = req.body.data?.FIELDS || req.body.data;
  console.log("bookingCreated:-",data)
   console.log("bookingCreated:-",req.body.data?.FIELDS)
  const deal_id = Number(data?.DEAL_ID || data?.ID);

  if (!deal_id) {
    throw new ApiError(400, "deal_id required");
  }

  const startOTP = generateOTP();

  const booking = await Booking.findOneAndUpdate(
    { deal_id },
    { start_otp: startOTP, status: "pending" },
    { upsert: true, new: true }
  );

  await axios.post(`https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json`, {
    ID: deal_id,
    fields: {
      UF_CRM_1773128404473: startOTP,
      COMMENTS: `🔢 Start OTP generated for Deal ID: ${deal_id}`
    }
  });

  return res.json(new ApiResponse(200, { deal_id, startOTP }, "OTP generated"));
});

// 2️⃣ Verify Start OTP
export const verifyStartOTP = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { deal_id, otp } = req.body;

  if (req.body?.auth?.application_token !== "1mg3n9w7edjll06yxilumza1z3l5qrjz") {
    throw new ApiError(403, "Unauthorized");
  }

  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.start_otp !== otp) throw new ApiError(401, "Invalid OTP");
  if (booking.status === "started") return res.json(new ApiResponse(200, {}, "Already started"));

  booking.status = "started";
  booking.start_time = new Date();
  booking.completion_otp_generated = false;
  await booking.save();

  try {
    await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
      ID: deal_id,
      fields: {
        COMMENTS: "✅ Service Started."
      }
    });
  } catch (err) {
    console.log("❌ Bitrix error:", err.message);
  }

  return res.json(new ApiResponse(200, {}, "Service started"));
});

// 3️⃣ Verify Completion OTP
export const verifyCompletionOTP = asyncHandler(async (req, res) => {
  const { deal_id, otp } = req.body;

  if (req.body?.auth?.application_token !== "n0mak7pbxpk2ef0dk0wx9rtpqum76d7j") {
    throw new ApiError(403, "Unauthorized");
  }

  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.completion_otp !== otp) throw new ApiError(401, "Invalid Completion OTP");

  booking.status = "completed";
  booking.end_time = new Date();
  await booking.save();

  try {
    await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
      ID: deal_id,
      fields: {
        STAGE_ID: "C1:WON",
        COMMENTS: "🏁 Service Completed"
      }
    });
  } catch (err) {
    console.log("❌ Bitrix error:", err.message);
  }

  return res.json(new ApiResponse(200, {}, "Work completed"));
});