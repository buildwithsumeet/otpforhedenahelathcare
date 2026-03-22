import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, BITRIX_WEBHOOK } from "../config.js";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET
});

export const createOrder = asyncHandler(async (req, res) => {
  const { deal_id, amount } = req.body; // Amount direct integer/float (no conversion)

  const order = await razorpay.orders.create({
    amount: amount, 
    currency: "INR",
    notes: { deal_id }
  });
  res.json({ ...order, deal_id });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  console.log("🔍 Verify hit:", req.body)  // ← Add karo

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, deal_id } = req.body;

  const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const expectedSignature = hmac.digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  console.log("✅ Signature valid")  // ← Add karo

  try {
    const booking = await Booking.findOneAndUpdate(
      { deal_id: Number(deal_id) }, 
      { payment_id: razorpay_payment_id, order_id: razorpay_order_id, status: "booked" },
      { upsert: true, new: true }
    );
    console.log("✅ Booking saved:", booking)  // ← Add karo

    const response = await axios.post("https://hedenahealthcare.bitrix24.in/rest/19/qu4pw71ycvsk24d1/crm.deal.update.json", {
      id: deal_id,
      fields: {
        UF_CRM_1773904189668: "PAID",
        UF_CRM_1773902195825: razorpay_payment_id,
        UF_CRM_1773813535000: razorpay_order_id
      }
    });
    console.log("✅ Bitrix updated:", response.data)  // ← Add karo

    res.status(200).json({ success: true, booking_id: booking.booking_id, deal_id });
  } catch(err) {
    console.error("❌ Error:", err.message)  // ← Add karo
    res.status(500).json({ success: false, message: err.message })
  }
});
