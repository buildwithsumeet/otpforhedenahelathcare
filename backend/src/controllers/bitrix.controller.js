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

// ✅ Retry helper for Bitrix 503s
const bitrixPost = async (url, data, retries = 3) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await axios.post(url, data);
      return res;
    } catch (err) {
      console.log(`❌ Bitrix attempt ${i} failed:`, err.response?.status, err.message);
      if (i < retries) {
        await new Promise(r => setTimeout(r, 1000 * i)); // 1s, 2s
      }
    }
  }
  console.log(`⚠️ Bitrix update failed after ${retries} attempts`);
};

export const dealCreated = asyncHandler(async (req, res) => {
  console.log("📩 Bitrix Hit:", req.body);

  if (req.body?.auth?.application_token !== "yvxw0jq6yy85wud4h11tclellumz7ip5") {
    return res.status(403).json({ message: "Unauthorized" });
  }

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

  // ✅ Step 2: Create payment link
  const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}`;

  // ✅ Small delay between get and update to avoid rate limit
  await new Promise(r => setTimeout(r, 500));

  // ✅ Step 3: Update deal with payment link with retry
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