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

  // ✅ Bitrix Deal ID = booking_id
  let booking_id =
    req.body?.data?.FIELDS?.ID ||
    req.body?.data?.ID

  booking_id = Number(booking_id)

  if (!booking_id || isNaN(booking_id)) {
    throw new ApiError(400, "Invalid Booking ID")
  }

  console.log("✅ Booking ID:", booking_id)

  // Already exist check
  const existing = await Booking.findOne({ booking_id })
  if (existing) {
    return res.json(new ApiResponse(200, {}, "Already exists"))
  }

  const startOTP = generateOTP()

  await Booking.create({
    booking_id,
    start_otp: startOTP,
    start_otp_expiry: Date.now() + 10 * 60 * 1000,
    status: "pending"
  })

  // ✅ Bitrix me OTP save
  try {
    await axios.post(`https://hedenahealthcare.bitrix24.in/rest/19/abyh3b8ueaqikfld/crm.deal.update.json`, {
      ID: booking_id,
      fields: {
        UF_CRM_1773128404473: startOTP   // your Start OTP field
      }
    })

    console.log("✅ Start OTP sent to Bitrix")

  } catch (error) {
    console.log("❌ Bitrix error:", error.response?.data)
  }

  return res.json(
    new ApiResponse(200, { booking_id, startOTP }, "OTP generated")
  )
})


// 2️⃣ Verify Start OTP
export const verifyStartOTP = asyncHandler(async (req,res)=>{

  const { booking_id, otp } = req.body

  if (!req.body?.auth || req.body.auth.application_token !== "1mg3n9w7edjll06yxilumza1z3l5qrjz") {
    throw new ApiError(403, "Unauthorized")
  }

  if(!booking_id || !otp){
    throw new ApiError(400,"Required fields missing")
  }

  const booking = await Booking.findOne({ booking_id })

  if(!booking){
    throw new ApiError(404,"Booking not found")
  }

  if(booking.start_otp !== otp){
    throw new ApiError(401,"Invalid OTP")
  }

  if(booking.status === "started"){
    return res.json(new ApiResponse(200,{},"Already started"))
  }

  booking.status = "started"
  booking.start_time = new Date()
  booking.completion_otp_generated = false

  await booking.save()

  // ✅ Bitrix comment
  try {
    await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
  ID: booking_id,
  fields: {
    COMMENTS: "✅ Service Started"
  }
})
  } catch (err) {
    console.log("❌ Bitrix error:", err.response?.data)
  }

  return res.json(
    new ApiResponse(200,{},"Service started")
  )
})






// 3️⃣ Verify Completion OTP
export const verifyCompletionOTP = asyncHandler(async (req,res)=>{

  const { booking_id, otp } = req.body

  if (!req.body?.auth || req.body.auth.application_token !== "n0mak7pbxpk2ef0dk0wx9rtpqum76d7j") {
    throw new ApiError(403, "Unauthorized")
  }

  const booking = await Booking.findOne({ booking_id })

  if(!booking) throw new ApiError(404,"Not found")

  if(booking.completion_otp !== otp){
    throw new ApiError(401,"Invalid OTP")
  }

  booking.status = "completed"
  booking.end_time = new Date()

  await booking.save()

  // ✅ Bitrix stage update
  try {
 await axios.post(
  "https://hedenahealthcare.bitrix24.in/rest/19/abyh3b8ueaqikfld/crm.deal.update.json",
  {
    ID: booking_id,
    fields: {
      STAGE_ID: "C1:WON"
    }
  }
)
  } catch (err) {
    console.log("❌ Bitrix error:", err.response?.data)
  }

  return res.json(
    new ApiResponse(200,{},"Work completed")
  )
}) 