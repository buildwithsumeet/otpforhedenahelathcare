// import asyncHandler from "../utils/asyncHandler.js"
// import ApiError from "../utils/ApiError.js"
// import ApiResponse from "../utils/ApiResponse.js"
// import Booking from "../models/Booking.js"
// import { generateOTP } from "../utils/generateOTP.js"
// import axios from "axios"
// import { BITRIX_WEBHOOK, BITRIX_TOKEN, FRONTEND_URL } from "../config.js"



// export const dealCreated = asyncHandler(async (req, res) => {
//   console.log("📩 Bitrix Hit:", req.body);

//   // security
//   if (req.body?.auth?.application_token !== "yvxw0jq6yy85wud4h11tclellumz7ip5") {
//     return res.status(403).json({ message: "Unauthorized" });
//   }

//   const dealId = Number(req.body?.data?.FIELDS?.ID);

//   if (!dealId) {
//     return res.status(400).json({ message: "Invalid Deal ID" });
//   }

//   // console.log("Deal ID:", dealId);

//   // 🔥 Step 1: Get full deal details
//   const dealResponse = await axios.post(
//     "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.get.json",
//     { id: dealId }
//   );

//   const deal = dealResponse.data.result;

//   if (!deal) {
//     // console.log("Deal fetch failed:", dealResponse.data);
//     return res.status(404).json({ message: "Deal not found" });
//   }

//   const amount = Number(deal.OPPORTUNITY) || 0;

//   // console.log("💰 Amount:", amount);
//   // console.log("Deal Title:", deal.TITLE);
//   // console.log("Stage:", deal.STAGE_ID);
//   // console.log("Full deal object:", deal); // ← debugging ke liye (sab fields dekhne ke liye)

//   // 🔥 Step 2: Create frontend payment link
//   // (yahan dealId ko string mein convert kar rahe the → sahi nahi tha)
//   const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}`;

//   // 🔥 Step 3: Update deal with payment link
//   await axios.post(
//     "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json",
//     {
//       id: dealId,
//       fields: {
//         UF_CRM_1773813535000: paymentLink,   
//       },
//     }
//   );

//   // console.log("✅ Payment link updated in Bitrix:", paymentLink);

//   res.json({ success: true, paymentLink });
// });


import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN, FRONTEND_URL } from "../config.js"

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

      // If it's a client error (4xx) other than Rate Limit (429), don't retry.
      // Data is probably wrong, so retrying won't fix it.
      if (status >= 400 && status < 500 && status !== 429) {
        console.log("🛑 Client error detected. Skipping retries.");
        break;
      }

      if (i < retries) {
        // Exponential backoff: 2s, 4s, 8s, 16s... gives server more time to recover
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`⏳ Waiting ${waitTime / 1000}s before next attempt...`);
        await new Promise((r) => setTimeout(r, waitTime));
      }
    }
  }
  console.log(`⚠️ Bitrix update failed after ${retries} attempts`);
  return null;
};

export const dealCreated = asyncHandler(async (req, res) => {
  console.log("📩 Bitrix Hit:", req.body);

  if (req.body?.auth?.application_token !== "yvxw0jq6yy85wud4h11tclellumz7ip5") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // ✅ Random delay to avoid simultaneous Bitrix hits with other webhooks
  await new Promise(r => setTimeout(r, Math.random() * 1000));

  const dealId = Number(req.body?.data?.FIELDS?.ID);
  if (!dealId) {
    return res.status(400).json({ message: "Invalid Deal ID" });
  }

  // ✅ Step 1: Get full deal details with retry
  const dealResponse = await bitrixPost(
    "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.get.json",
    { id: dealId }
  );

  const deal = dealResponse?.data?.result;
  if (!deal) {
    return res.status(404).json({ message: "Deal not found" });
  }

  const amount = Number(deal.OPPORTUNITY) || 0;
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now (for frontend to check)
  const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}&expires_at=${expiresAt}`;

  // ✅ Store Link creation time for 10-minute expiry check
  await Booking.findOneAndUpdate(
    { deal_id: Number(dealId) },
    { payment_link_created_at: new Date(), status: "pending" },
    { upsert: true, new: true }
  );

  // ✅ Small delay between get and update
  await new Promise(r => setTimeout(r, 500));

  // ✅ Step 2: Update deal with payment link
  await bitrixPost(
    "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json",
    {
      id: dealId,
      fields: {
        UF_CRM_1773813535000: paymentLink,
      },
    }
  );

  console.log("✅ Payment link updated in Bitrix:", paymentLink);
  res.json({ success: true, paymentLink });
});