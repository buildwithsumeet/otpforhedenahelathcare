import cron from "node-cron";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import axios from "axios";

console.log("✅ Payment Expiry Cron module loaded");

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

// ✅ Payment Expiry Cron Job - Runs every minute
const paymentExpiryCron = cron.schedule("* * * * *", async () => {
  console.log("⏰ Payment Expiry Cron checking for expired links...");

  if (mongoose.connection.readyState !== 1) {
    console.log("❌ DB not connected, skipping cron");
    return;
  }

  try {
    const now = new Date();
    const tenMinutesAgo = new Date(now - 10 * 60 * 1000); // 10 minutes ago

    // ✅ Find bookings with expired payment links
    const expiredBookings = await Booking.find({
      status: "pending",
      payment_link_created_at: { $ne: null, $lte: tenMinutesAgo },
      deal_id: { $ne: null }
    });

    if (expiredBookings.length === 0) {
      console.log("✅ No expired payment links found");
      return;
    }

    console.log(`🔍 Found ${expiredBookings.length} expired payment link(s)`);

    for (const booking of expiredBookings) {
      const age = Math.round((now - new Date(booking.payment_link_created_at)) / 1000);
      console.log(`⏰ Expiring Deal ${booking.deal_id} - Link age: ${age}s`);

      // ✅ Update booking status to expired
      const updated = await Booking.findOneAndUpdate(
        {
          _id: booking._id,
          status: "pending" // Only update if still pending
        },
        {
          status: "expired"
        },
        { new: true }
      );

      if (!updated) {
        console.log(`⏭️ Skipping Deal ${booking.deal_id} — Status already changed`);
        continue;
      }

      console.log(`✅ Deal ${booking.deal_id} marked as expired`);

      // ✅ Update Bitrix with expired status
      await bitrixPost(
        `https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json`,
        {
          id: booking.deal_id,
          fields: {
            UF_CRM_1773904189668: "EXPIRED", // Payment status field
            COMMENTS: `⏰ Payment link expired after 10 minutes for Deal ${booking.deal_id}`
          }
        }
      );
      console.log(`✅ Bitrix updated for expired Deal ${booking.deal_id}`);
    }
  } catch (error) {
    console.error("❌ Payment Expiry Cron Error:", error.message);
  }
});

export default paymentExpiryCron;
