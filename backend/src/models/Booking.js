import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  booking_id: { type: Number, unique: true }, // Bitrix se aane wala ID
  deal_id: { type: Number, unique: true },    // Bitrix se aane wala ID

  order_id: String,
  payment_id: String,

  start_otp: String,
  completion_otp: String,
  completion_otp_generated: { type: Boolean, default: false },
  
  start_time: Date,
  end_time: Date,
  status: {
    type: String,
    enum: ["pending", "booked", "started", "completed"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
