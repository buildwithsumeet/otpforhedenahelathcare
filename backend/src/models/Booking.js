import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  booking_id:{
    type:String,
    required:true,
    unique:true
  },

  start_otp:String,

  completion_otp:String,

  status:{
    type:String,
    default:"pending"
  },

  start_time:Date,

  end_time:Date,

  completion_otp_created_at:Date

})

export default mongoose.model("Booking",bookingSchema)