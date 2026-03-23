import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";

console.log("✅ Completion OTP Cron module loaded");

const cronJob = cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron checking for 10-min threshold...");

  if (mongoose.connection.readyState !== 1) {
    console.log("❌ DB not connected, skipping cron");
    return;
  }

  try {
    const now = new Date();
    const tenMinutesAgo = new Date(now - 10 * 60 * 1000);

    // ✅ DB check — bookings with existing completion_otp are never fetched
    const bookings = await Booking.find({
      status: "started",
      completion_otp_generated: false,
      completion_otp: { $in: [null, undefined, ""] }, // ✅ Skip if OTP already in DB
      start_time: { $ne: null, $lte: tenMinutesAgo },
      deal_id: { $ne: null },
      booking_id: { $ne: null }
    });

    if (bookings.length === 0) {
      console.log("✅ No pending bookings found");
      return;
    }

    for (const booking of bookings) {
      const otp = generateOTP();

      // ✅ Atomic update — double check at DB level before writing
      const updated = await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          completion_otp_generated: false,
          completion_otp: { $in: [null, undefined, ""] } // ✅ Final guard
        },
        {
          completion_otp: otp,
          completion_otp_generated: true,
          completion_otp_created_at: new Date()
        },
        { new: true }
      );

      if (!updated) {
        console.log(`⏭️ Skipping Deal ${booking.deal_id} — OTP already exists in DB`);
        continue;
      }

      console.log(`🔢 OTP Generated: ${otp} for Booking: ${booking.booking_id}`);

      try {
        await axios.post(
          `https://hedenahealthcare.bitrix24.in/rest/19/khl66brzilmeicwl/crm.deal.update.json`,
          {
            ID: booking.deal_id,
            fields: {
              UF_CRM_1773809108597: otp,
              COMMENTS: `🏁 Completion OTP ${otp} generated for Booking ID: ${booking.booking_id}`
            }
          }
        );
        console.log(`✅ Bitrix Deal ${booking.deal_id} updated successfully`);

      } catch (err) {
        console.error(`❌ Bitrix Error for Deal ${booking.deal_id}:`, err.response?.data || err.message);
        console.log(`⚠️ OTP ${otp} saved in DB but Bitrix update failed for Deal ${booking.deal_id}`);
      }
    }
  } catch (error) {
    console.error("❌ General Cron Error:", error.message);
  }
});

export default cronJob;