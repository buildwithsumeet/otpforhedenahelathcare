import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js"



export const dealCreated = asyncHandler(async (req, res) => {
  console.log("📩 Bitrix Hit:", req.body);

  // security
  if (req.body?.auth?.application_token !== "yvxw0jq6yy85wud4h11tclellumz7ip5") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const dealId = Number(req.body?.data?.FIELDS?.ID);

  if (!dealId) {
    return res.status(400).json({ message: "Invalid Deal ID" });
  }

  console.log("Deal ID:", dealId);

  // 🔥 Step 1: Get full deal details
  const dealResponse = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.get.json",
    { id: dealId }
  );

  const deal = dealResponse.data.result;

  if (!deal) {
    console.log("Deal fetch failed:", dealResponse.data);
    return res.status(404).json({ message: "Deal not found" });
  }

  const amount = Number(deal.OPPORTUNITY) || 0;

  console.log("💰 Amount:", amount);
  console.log("Deal Title:", deal.TITLE);
  console.log("Stage:", deal.STAGE_ID);
  // console.log("Full deal object:", deal); // ← debugging ke liye (sab fields dekhne ke liye)

  // 🔥 Step 2: Create frontend payment link
  // (yahan dealId ko string mein convert kar rahe the → sahi nahi tha)
  const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}`;

  // 🔥 Step 3: Update deal with payment link
  await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json",
    {
      id: dealId,
      fields: {
        UF_CRM_1773809108597: paymentLink,   // yeh custom field hai payment link ke liye
        // Agar aur kuch update karna ho to yahan daal sakte ho, jaise:
        // COMMENT: `Payment link generated: ${paymentLink}`,
      },
    }
  );

  console.log("✅ Payment link updated in Bitrix:", paymentLink);

  res.json({ success: true, paymentLink });
});