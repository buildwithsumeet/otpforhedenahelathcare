import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  deal_id: { type: Number, unique: true },
  booking_id: { type: String }, // ✅ Used in cron logs

  order_id: String,
  payment_id: String,

  start_otp: String,
  completion_otp: { type: String, default: null }, // ✅ null by default for $in check
  completion_otp_generated: { type: Boolean, default: false },
  completion_otp_created_at: { type: Date, default: null }, // ✅ Used in cron update

  payment_link_created_at: Date,

  start_time: Date,
  end_time: Date,
  status: {
    type: String,
    enum: ["pending", "booked", "started", "completed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);