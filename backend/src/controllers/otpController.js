import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import {generateOTP }from "../utils/generateOTP.js"


/*
--------------------------------
1️⃣ Booking Created Webhook
--------------------------------
CRM jab booking create karega
toh webhook hit karega
*/
const bookingCreated = asyncHandler(async (req,res)=>{

 const { booking_id } = req.body

 if(!booking_id){
  throw new ApiError(400,"Booking id required")
 }

 const startOTP = generateOTP()

 const booking = await Booking.create({
  booking_id,
  start_otp:startOTP,
  status:"pending"
 })

 return res.status(201).json(
  new ApiResponse(
   201,
   { booking_id,startOTP },
   "Start OTP generated successfully"
  )
 )

})


/*
--------------------------------
2️⃣ Start OTP Verify
--------------------------------
Provider start OTP enter karega
*/
const verifyStartOTP = asyncHandler(async (req,res)=>{

 const { booking_id,otp } = req.body

 if(!booking_id || !otp){
  throw new ApiError(400,"Booking id and otp required")
 }

 const booking = await Booking.findOne({ booking_id })

 if(!booking){
  throw new ApiError(404,"Booking not found")
 }

 if(booking.start_otp !== otp){
  throw new ApiError(401,"Invalid OTP")
 }

 booking.status = "started"
 booking.start_time = new Date()

 await booking.save({ validateBeforeSave:false })



 /*
 10 minute delay completion OTP
 */

 setTimeout(async()=>{

  const completionOTP = generateOTP()

  await Booking.findOneAndUpdate(
   { booking_id },
   {
    completion_otp:completionOTP,
    completion_otp_created_at:new Date()
   }
  )

  console.log("Completion OTP Generated:",completionOTP)

 },10 * 60 * 1000)



 return res.status(200).json(
  new ApiResponse(
   200,
   { booking_id },
   "Service started successfully. Completion OTP will generate in 10 minutes"
  )
 )

})


/*
--------------------------------
3️⃣ Completion OTP Verify
--------------------------------
Provider work complete hone par OTP dalega
*/
const verifyCompletionOTP = asyncHandler(async (req,res)=>{

 const { booking_id,otp } = req.body

 if(!booking_id || !otp){
  throw new ApiError(400,"Booking id and otp required")
 }

 const booking = await Booking.findOne({ booking_id })

 if(!booking){
  throw new ApiError(404,"Booking not found")
 }

 if(booking.completion_otp !== otp){
  throw new ApiError(401,"Invalid completion OTP")
 }

 booking.status = "completed"
 booking.end_time = new Date()

 await booking.save({ validateBeforeSave:false })


 return res.status(200).json(
  new ApiResponse(
   200,
   { booking_id },
   "Service completed successfully"
  )
 )

})


export {
 bookingCreated,
 verifyStartOTP,
 verifyCompletionOTP
}