import cron from "node-cron"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK } from "../config.js"

// ⏰ every 1 minute
cron.schedule("* * * * *", async () => {

  console.log("⏰ Cron running...")

  try {
    const now = new Date()

    const bookings = await Booking.find({
      status: "started",
      completion_otp_generated: false,
      start_time: { $ne: null }
    })

    for (const booking of bookings) {

      const diff = now - new Date(booking.start_time)

      // ✅ 10 min delay validation
      if (diff >= 10 * 60 * 1000) {

        // 🔥 duplicate safe update
        const updated = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            completion_otp_generated: false
          },
          {
            completion_otp: generateOTP(),
            completion_otp_generated: true,
            completion_otp_created_at: new Date()
          },
          { new: true }
        )

        if (!updated) continue

        console.log("🔢 OTP Generated:", updated.completion_otp)

        // ✅ Bitrix send
        try {
          await axios.post(`${BITRIX_WEBHOOK}/crm.timeline.comment.add.json`, {
            fields: {
              ENTITY_ID: booking.deal_id,
              ENTITY_TYPE: "deal",
              COMMENT: `🔢 Completion OTP: ${updated.completion_otp}`
            }
          })

          console.log("✅ Bitrix updated")

        } catch (err) {
          console.log("❌ Bitrix error:", err.response?.data)

          // rollback
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