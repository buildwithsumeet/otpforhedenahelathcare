import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js"

// 1️⃣ Bitrix Outbound Webhook (Deal Create)
export const bookingCreated = asyncHandler(async (req,res)=>{

     console.log("📩 Bitrix Webhook Hit:", req.body)

  // Security
  if(req.body?.auth?.application_token !== BITRIX_TOKEN){
    throw new ApiError(403,"Unauthorized")
  }

  const dealId = req.body?.data?.FIELDS?.ID

  if(!dealId){
    throw new ApiError(400,"Deal ID missing")
  }

  const booking_id = dealId

  const existing = await Booking.findOne({ booking_id })
  if(existing){
    return res.json(new ApiResponse(200,{},"Already exists"))
  }

  const startOTP = generateOTP()

  await Booking.create({
    booking_id,
    deal_id: dealId,
    start_otp: startOTP,
    start_otp_expiry: Date.now() + 10 * 60 * 1000
  })

  // Update Bitrix
  await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
    ID: dealId,
    fields: {
      UF_CRM_START_OTP: startOTP
    }
  })

  return res.json(
    new ApiResponse(200,{ booking_id,startOTP },"OTP generated")
  )
})


// 2️⃣ Verify Start OTP
export const verifyStartOTP = asyncHandler(async (req,res)=>{

  const { booking_id, otp } = req.body

  if(!booking_id || !otp){
    throw new ApiError(400,"Required fields missing")
  }

  const booking = await Booking.findOne({ booking_id })

  if(!booking) throw new ApiError(404,"Not found")

  if(booking.start_otp !== otp){
    throw new ApiError(401,"Invalid OTP")
  }

  if(Date.now() > booking.start_otp_expiry){
    throw new ApiError(400,"OTP expired")
  }

  booking.status = "started"
  booking.start_time = new Date()

  await booking.save()

  return res.json(new ApiResponse(200,{},"Service started"))
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