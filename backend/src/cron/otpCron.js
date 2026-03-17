import cron from "node-cron"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK } from "../config.js"

// run every minute
cron.schedule("* * * * *", async ()=>{

  console.log("Checking OTP...")

  const bookings = await Booking.find({
    status: "started",
    completion_otp_generated: false
  })

  for(const booking of bookings){

    const diff = Date.now() - new Date(booking.start_time).getTime()

    if(diff >= 10 * 60 * 1000){

      const otp = generateOTP()

      await Booking.findByIdAndUpdate(booking._id,{
        completion_otp: otp,
        completion_otp_generated: true
      })

      console.log("Completion OTP:", otp)

      // Bitrix update
      await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
        ID: booking.deal_id,
        fields: {
          UF_CRM_COMPLETION_OTP: otp
        }
      })
    }
  }

})