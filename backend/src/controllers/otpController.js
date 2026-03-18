import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js"

// 1️⃣ Bitrix Outbound Webhook (Deal Create)
export const bookingCreated = asyncHandler(async (req, res) => {

  console.log("📩 Bitrix Webhook Hit:", JSON.stringify(req.body, null, 2))

  // Security
  if (!req.body?.auth || req.body.auth.application_token !== BITRIX_TOKEN) {
    throw new ApiError(403, "Unauthorized")
  }

  // ✅ Handle multiple payload formats
  let dealId =
    req.body?.data?.FIELDS?.ID ||
    req.body?.data?.ID

  // ✅ Convert to number
  dealId = Number(dealId)

  if (!dealId || isNaN(dealId)) {
    throw new ApiError(400, "Invalid Deal ID")
  }

  console.log("✅ Deal ID:", dealId)

  const booking_id = dealId

  // Check existing booking
  const existing = await Booking.findOne({ booking_id })
  if (existing) {
    return res.json(new ApiResponse(200, {}, "Already exists"))
  }

  const startOTP = generateOTP()

  await Booking.create({
    booking_id,
    deal_id: dealId,
    start_otp: startOTP,
    start_otp_expiry: Date.now() + 10 * 60 * 1000
  })

  // ✅ Safe Bitrix update
  try {
    const response = await axios.post(
      "https://hedenahealthcare.bitrix24.in/rest/19/abyh3b8ueaqikfld/crm.deal.update.json",
      {
        id: dealId,
        fields: {
          UF_CRM_1773128404473: startOTP
        }
      }
    )

    console.log("✅ Bitrix Update Response:", response.data)

  } catch (error) {
    console.error("❌ Bitrix Update Error:", error.response?.data || error.message)
  }

  return res.json(
    new ApiResponse(200, { booking_id, startOTP }, "OTP generated")
  )
})


// 2️⃣ Verify Start OTP
export const verifyStartOTP = asyncHandler(async (req,res)=>{

  const { booking_id, otp } = req.body

  // 🔴 Validation
  if(!booking_id || !otp){
    throw new ApiError(400,"Required fields missing")
  }

  const booking = await Booking.findOne({ booking_id })

  if(!booking){
    throw new ApiError(404,"Booking not found")
  }

  // 🔴 OTP match
  if(booking.start_otp !== otp){
    throw new ApiError(401,"Invalid OTP")
  }

  // 🔴 Expiry check
  // if(booking.start_otp_expiry && Date.now() > booking.start_otp_expiry){
  //   throw new ApiError(400,"OTP expired")
  // }

  // 🔥 Already started check (IMPORTANT)
  if(booking.status === "started"){
    return res.json(
      new ApiResponse(200,{},"Service already started")
    )
  }

  // ✅ Update booking (CRON ke liye important fields)
  booking.status = "started"
  booking.start_time = new Date()
  booking.completion_otp_generated = false // 👈 cron use karega

  await booking.save()

  // 🔥 Bitrix update (validation msg)
  try {
    await axios.post({BITRIX_WEBHOOK}, {
      fields: {
        ENTITY_ID: booking.deal_id,
        ENTITY_TYPE: "deal",
        COMMENT: "✅ Service Started (OTP Verified)"
      }
    })

    console.log("✅ Bitrix updated (start)")

  } catch (error) {
    console.log("❌ Bitrix error:", error.response?.data)
  }

  return res.json(
    new ApiResponse(200,{},"Service started successfully")
  )
})


// 3️⃣ Verify Completion OTP
export const verifyCompletionOTP = asyncHandler(async (req,res)=>{

  const { booking_id, otp } = req.body

  const booking = await Booking.findOne({ booking_id })

  if(!booking) throw new ApiError(404,"Not found")

  if(booking.completion_otp !== otp){
    throw new ApiError(401,"Invalid OTP")
  }

  booking.status = "completed"
  booking.end_time = new Date()

  await booking.save()

  // Bitrix Deal Complete
  await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
    ID: booking.deal_id,
    fields: {
      STAGE_ID: "C1:WON"
    }
  })

  return res.json(new ApiResponse(200,{},"Work completed"))
})