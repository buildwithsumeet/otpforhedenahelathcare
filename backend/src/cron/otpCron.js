import cron from "node-cron"
import mongoose from "mongoose"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK } from "../config.js"

console.log("✅ OTP Cron module loaded")

// ⏰ every 1 minute
const cronJob = cron.schedule("* * * * *", async () => {

  console.log("⏰ Cron running...")

  // Check if DB is connected
  if (mongoose.connection.readyState !== 1) {
    console.log("❌ DB not connected, skipping cron")
    return
  }

  try {
    const now = new Date()

    const bookings = await Booking.find({
      status: "started",
      completion_otp_generated: false,
      start_time: { $ne: null }
    })

    for (const booking of bookings) {

      const diff = now - new Date(booking.start_time)

      // ✅ 10 min delay
      if (diff >= 10 * 60 * 1000) {

        const otp = generateOTP()

        // 🔥 duplicate safe update
        const updated = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            completion_otp_generated: false
          },
          {
            completion_otp: otp,
            completion_otp_generated: true,
            completion_otp_created_at: new Date()
          },
          { new: true }
        )

        if (!updated) continue

        console.log("🔢 Completion OTP Generated:", otp)

        // ✅ Bitrix Update
        try {
          const response = await axios.post(
            `${BITRIX_WEBHOOK}/crm.deal.update.json`,
            {
              ID: booking.deal_id,   // ✅ FIXED
              fields: {
                UF_CRM_1773809108597: otp   // ⚠️ apna correct field ID use karo
              }
            }
          )

          console.log("✅ Bitrix updated:", response.data)

        } catch (err) {
          console.log("❌ Bitrix error:", err.response?.data || err.message)

          // 🔁 rollback if Bitrix failed
          await Booking.findByIdAndUpdate(booking._id, {
            completion_otp_generated: false
          })
        }
      }
    }

  } catch (error) {
    console.log("❌ Cron error:", error.message)
  }

})