// src/models/Booking.js
import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  booking_id: Number,
  deal_id: Number,

  order_id: String,
  payment_id: String,

  start_otp: String,
  completion_otp: String,

  start_time: Date,
  end_time: Date,

  completion_otp_generated: {
    type: Boolean,
    default: false
  },

  status: {
    type: String,
    enum: ["pending", "booked", "started", "completed"],
    default: "pending"
  }

}, { timestamps: true })

export default mongoose.model("Booking", bookingSchema)