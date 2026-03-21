import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Booking from "../models/Booking.js"
import { generateOTP } from "../utils/generateOTP.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js"




export const dealCreated = asyncHandler(async (req, res) => {

  console.log("📩 Bitrix Hit:", req.body)

  // security
  if (req.body?.auth?.application_token !== BITRIX_TOKEN) {
    return res.status(403).json({ message: "Unauthorized" })
  }

  const dealId = Number(req.body?.data?.FIELDS?.ID)

  console.log(dealId)

  if (!dealId) {
    return res.status(400).json({ message: "Invalid Deal ID" })
  }

  // 🔥 Step 1: Get deal details (amount)
  const dealResponse = await axios.post(
    `${BITRIX_WEBHOOK}/crm.deal.get.json`,
    { id: dealId }
  )

  const deal = dealResponse.data.result

  const amount = deal.OPPORTUNITY || 0   // 💰 amount

  console.log("💰 Amount:", amount)

  // 🔥 Step 2: Create frontend payment link
  const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}&amount=${amount}`

  // 🔥 Step 3: Send to Bitrix
  await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
    id: dealId,
    fields: {
      UF_PAYMENT_LINK: paymentLink
    }
  })

  console.log("✅ Payment link sent:", paymentLink)

  res.json({ success: true })
})