// src/controllers/paymentController.js
import Razorpay from "razorpay"
import crypto from "crypto"
import Booking from "../models/Booking.js"
import asyncHandler from "../utils/asyncHandler.js"
import axios from "axios"
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, BITRIX_WEBHOOK } from "../config.js"

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
})


// CREATE ORDER
export const createOrder = asyncHandler(async (req, res) => {

  const { deal_id, amount } = req.body

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  })

  res.json(order)
})


// VERIFY PAYMENT
export const verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    deal_id
  } = req.body

  const body = razorpay_order_id + "|" + razorpay_payment_id

  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex")

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" })
  }

  // 🔥 create booking after payment
  const booking = await Booking.findOneAndUpdate(
    { booking_id: deal_id },
    {
      booking_id: deal_id,
      deal_id,
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      status: "booked"
    },
    { upsert: true, new: true }
  )

  // 🔥 Generate Start OTP
  const startOTP = Math.floor(1000 + Math.random() * 9000)

  booking.start_otp = startOTP
  await booking.save()

  // 🔥 Bitrix update
  await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
    id: deal_id,
    fields: {
      STAGE_ID: "PAID",
      UF_START_OTP: startOTP
    }
  })

  res.json({ success: true })
})