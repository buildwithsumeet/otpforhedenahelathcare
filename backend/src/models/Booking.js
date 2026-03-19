import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  booking_id: { type: String, unique: true },
  deal_id: String,

  start_otp: String,
  start_otp_expiry: Number,

  completion_otp: String,
  completion_otp_generated: {
    type: Boolean,
    default: false
  },
  completion_otp_created_at: Date,

  status: {
    type: String,
    enum: ["pending", "started", "completed"],
    default: "pending"
  },

  start_time: Date,
  end_time: Date

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);