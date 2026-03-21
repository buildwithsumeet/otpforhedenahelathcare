import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js"



export const dealCreated = asyncHandler(async (req, res) => {
  const dealId = req.body?.data?.FIELDS?.ID; 
  if (!dealId) return res.status(400).json({ message: "No Deal ID" });

  // Use the full webhook URL from your Step 3 (the one you know works)
  const webhookBase = "https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1";

  try {
    // Step 1: Get deal details
    const dealResponse = await axios.post(`${webhookBase}/crm.deal.get.json`, { 
      id: dealId 
    });

    const deal = dealResponse.data.result;
    const amount = deal.OPPORTUNITY || 0;

    // Step 2: Create link (Using dealId, not the deal object)
    const paymentLink = `${process.env.FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}`;

    // Step 3: Update deal
    await axios.post(`${webhookBase}/crm.deal.update.json`, {
      id: dealId,
      fields: {
        UF_CRM_1773809108597: paymentLink
      }
    });

    res.json({ success: true, paymentLink });
  } catch (error) {
    console.error("Bitrix API Error:", error.response?.data || error.message);
    throw new ApiError(500, "Bitrix Integration Failed");
  }
});