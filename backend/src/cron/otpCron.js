import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";
import { BITRIX_WEBHOOK } from "../config.js";

console.log("✅ Completion OTP Cron module loaded");

// ⏰ Runs every 1 minute
const cronJob = cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron checking for 10-min threshold...");

  // 1. Check if DB is connected
  if (mongoose.connection.readyState !== 1) {
    console.log("❌ DB not connected, skipping cron");
    return;
  }

  try {
    const now = new Date();

    // 2. Find bookings started but without Completion OTP
    // Filter ensures both IDs exist before processing
    const bookings = await Booking.find({
      status: "started",
      completion_otp_generated: false,
      start_time: { $ne: null },
      deal_id: { $ne: null },
      booking_id: { $ne: null }
    });

    for (const booking of bookings) {
      const startTime = new Date(booking.start_time);
      const diff = now - startTime;

      // ✅ 10 minute delay check
      if (diff >= 10 * 60 * 1000) {
        const otp = generateOTP();

        // 3. Atomic Update to prevent duplicate generation
        const updated = await Booking.findOneAndUpdate(
          {
            _id: booking._id,
            completion_otp_generated: false // Re-verify flag inside query
          },
          {
            completion_otp: otp,
            completion_otp_generated: true,
            // Added this field to your model tracking
            completion_otp_created_at: new Date() 
          },
          { new: true }
        );

        // If another instance picked it up first, skip
        if (!updated) continue;

        console.log(`🔢 OTP Generated: ${otp} for Booking: ${booking.booking_id}`);

        // 4. Update Bitrix using DEAL_ID
        try {
          await axios.post(`https://hedenahealthcare.bitrix24.in/rest/19/khl66brzilmeicwl/crm.deal.update.json`, {
            ID: booking.deal_id, // 🔥 Using deal_id for Bitrix
            fields: {
              UF_CRM_1773809108597: otp, // Your Completion OTP field
              COMMENTS: `🏁 Completion OTP ${otp} generated for Booking ID: ${booking.booking_id}`
            }
          });

          console.log(`✅ Bitrix Deal ${booking.deal_id} updated successfully`);

        } catch (err) {
          console.error(`❌ Bitrix Error for Deal ${booking.deal_id}:`, err.response?.data || err.message);

          // 🔁 Rollback DB flag so it tries again in the next minute if Bitrix failed
          await Booking.findByIdAndUpdate(booking._id, {
            completion_otp_generated: false
          });
        }
      }
    }
  } catch (error) {
    console.error("❌ General Cron Error:", error.message);
  }
});

export default cronJob;
