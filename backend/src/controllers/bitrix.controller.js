// src/controllers/bitrixController.js
import asyncHandler from "../utils/asyncHandler.js"
import axios from "axios"
import { BITRIX_WEBHOOK, BITRIX_TOKEN, FRONTEND_URL } from "../config.js"

export const dealCreated = asyncHandler(async (req, res) => {

  console.log("📩 Bitrix Hit:", req.body)

  // security
  if (req.body?.auth?.application_token !== BITRIX_TOKEN) {
    return res.status(403).json({ message: "Unauthorized" })
  }

  const dealId = Number(req.body?.data?.FIELDS?.ID)

  if (!dealId) {
    return res.status(400).json({ message: "Invalid Deal ID" })
  }

  // 🔥 create payment link
  const paymentLink = `${FRONTEND_URL}/pay?deal_id=${dealId}`

  // send to Bitrix
  await axios.post(`${BITRIX_WEBHOOK}/crm.deal.update.json`, {
    id: dealId,
    fields: {
      UF_PAYMENT_LINK: paymentLink
    }
  })

  console.log("✅ Payment link sent:", paymentLink)

  res.json({ success: true })
})