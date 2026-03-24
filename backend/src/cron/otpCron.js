import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";

console.log("✅ Completion OTP Cron module loaded");

// ✅ Better Retry helper for Bitrix 502/503s with Exponential Backoff
const bitrixPost = async (url, data, retries = 5) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await axios.post(url, data);
      return res;
    } catch (err) {
      const status = err.response?.status;
      const message = err.message;

      console.log(`❌ Bitrix attempt ${i} failed:`, status || "No Status", message);

      if (status >= 400 && status < 500 && status !== 429) {
        console.log("🛑 Client error detected. Skipping retries.");
        break;
      }

      if (i < retries) {
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`⏳ Waiting ${waitTime / 1000}s before next attempt...`);
        await new Promise((r) => setTimeout(r, waitTime));
      }
    }
  }
  console.log(`⚠️ Bitrix update failed after ${retries} attempts`);
  return null;
};

const cronJob = cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron checking for 10-min threshold...");

  if (mongoose.connection.readyState !== 1) {
    console.log("❌ DB not connected, skipping cron");
    return;
  }

  try {
    const now = new Date();
   const tenMinutesAgo = new Date(now - 1 * 60 * 1000)

    const bookings = await Booking.find({
      status: "started",
      completion_otp_generated: false,
      completion_otp: { $in: [null, undefined, ""] },
      start_time: { $ne: null, $lte: tenMinutesAgo },
      deal_id: { $ne: null }
     
    });

    if (bookings.length === 0) {
      console.log("✅ No pending bookings found");
      return;
    }

    for (const booking of bookings) {
      const otp = generateOTP();

      const updated = await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          completion_otp_generated: false,
          completion_otp: { $in: [null, undefined, ""] }
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

      // ✅ Use bitrixPost for reliable update
      await bitrixPost(
        `https://hedenahealthcare.bitrix24.in/rest/19/khl66brzilmeicwl/crm.deal.update.json`,
        {
          ID: booking.deal_id,
          fields: {
            UF_CRM_1773809108597: otp,
            COMMENTS: `🏁 Completion OTP ${otp} generated for Booking ID: ${booking.booking_id}`
          }
        }
      );
      console.log(`✅ Bitrix sync attempted for Deal ${booking.deal_id}`);
    }
  } catch (error) {
    console.error("❌ General Cron Error:", error.message);
  }
});

export default cronJob;