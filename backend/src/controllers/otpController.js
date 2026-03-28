// import asyncHandler from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";
// import Booking from "../models/Booking.js";
// import { generateOTP } from "../utils/generateOTP.js";
// import axios from "axios";
// import { BITRIX_WEBHOOK, BITRIX_TOKEN } from "../config.js";

// // 1️⃣ Booking Created
// export const bookingCreated = asyncHandler(async (req, res) => {
//   if (req.body.auth?.application_token !== "szjlk848jizh0uhwrpcc8psyxhiy3gp6") {
//     throw new ApiError(403, "Unauthorized");
//   }

//   const data = req.body.data?.FIELDS || req.body.data;
//   console.log("bookingCreated:-", data);
//   console.log("bookingCreated:-", req.body.data?.FIELDS);

//   const deal_id = Number(data?.DEAL_ID || data?.ID);

//   if (!deal_id) {
//     throw new ApiError(400, "deal_id required");
//   }

//   // ✅ Check DB first — if OTP already exists, skip everything
//   const existingBooking = await Booking.findOne({ deal_id });
//   if (existingBooking?.start_otp) {
//     console.log(`⏭️ OTP already exists in DB for Deal ID: ${deal_id}, skipping`);
//     return res.json(new ApiResponse(200, { deal_id }, "OTP already exists, skipping"));
//   }

//   const startOTP = generateOTP();

//   await Booking.findOneAndUpdate(
//     { deal_id },
//     { start_otp: startOTP, status: "pending" },
//     { upsert: true, new: true }
//   );

//   await axios.post(
//     "https://hedenahealthcare.bitrix24.in/rest/19/ty5623yxuzz25qsj/crm.deal.update.json",
//     {
//       ID: deal_id,
//       fields: {
//         UF_CRM_1773809025643: startOTP,
//         COMMENTS: `🔢 Start OTP generated for Deal ID: ${deal_id}`
//       }
//     }
//   );

//   return res.json(new ApiResponse(200, { deal_id, startOTP }, "OTP generated"));
// });

// // 2️⃣ Verify Start OTP
// export const verifyStartOTP = asyncHandler(async (req, res) => {

//   if (req.body?.auth?.application_token !== "1keq4jkmzxaw9pfjeqnp5mieb35jnilk") {
//     throw new ApiError(403, "Unauthorized");
//   }

//   console.log("Full body:", JSON.stringify(req.body, null, 2));

//   const deal_id = req.body?.data?.FIELDS?.ID
//                ?? req.body?.ID
//                ?? req.body?.deal_id;

//   if (!deal_id || isNaN(Number(deal_id))) {
//     throw new ApiError(400, "Missing or invalid deal_id");
//   }

//   // ✅ Fetch full deal from Bitrix to get OTP
//   const dealRes = await axios.post(
//     `https://hedenahealthcare.bitrix24.in/rest/19/kmj7mkb4krro0tke/crm.deal.get.json`,
//     { ID: deal_id }
//   );

//   const otp = dealRes.data?.result?.UF_CRM_1773809025643;
//   console.log("OTP from Bitrix:", otp);

//   if (!otp) {
//     throw new ApiError(400, "Missing OTP");
//   }

//   const booking = await Booking.findOne({ deal_id: Number(deal_id) });
//   if (!booking) throw new ApiError(404, "Booking not found");

//   // ❌ Invalid OTP — update Bitrix status to Invalid
//   if (booking.start_otp !== otp) {
//     try {
//       await axios.post(
//         `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
//         {
//           ID: deal_id,
//           fields: {
//             UF_CRM_1774009819822: "Invalid" // ❌ First OTP Validation Status
//           }
//         }
//       );
//     } catch (err) {
//       console.log("❌ Bitrix error on invalid:", err.message);
//     }
//     throw new ApiError(401, "Invalid OTP");
//   }

//   if (booking.status === "started")
//     return res.json(new ApiResponse(200, {}, "Already started"));

//   booking.status = "started";
//   booking.start_time = new Date();
//   booking.completion_otp_generated = false;
//   await booking.save();

//   // ✅ Valid OTP — update Bitrix status to Verified
//   console.log("✅ Valid OTP — update Bitrix status to Verified")
//   try {
//     await axios.post(
//       `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
//       {
//         ID: deal_id,
//         fields: {
//           UF_CRM_1774009819822: "Verified", // ✅ First OTP Validation Status

//         }
//       }
//     );
//   } catch (err) {
//     console.log("❌ Bitrix error:", err.message);
//   }

//   return res.json(new ApiResponse(200, {}, "Service started"));
// });












// // 3️⃣ Verify Completion OTP
// export const verifyCompletionOTP = asyncHandler(async (req, res) => {

//   console.log("verifyCompletionOTP")

//   if (req.body?.auth?.application_token !== "i8z8odtqwrmzkysz56mby1yvlpnut930") {
//     throw new ApiError(403, "Unauthorized");
//   }

//   console.log("Full body:", JSON.stringify(req.body, null, 2));

//   const deal_id = req.body?.data?.FIELDS?.ID
//                ?? req.body?.ID
//                ?? req.body?.deal_id;

//   if (!deal_id || isNaN(Number(deal_id))) {
//     throw new ApiError(400, "Missing or invalid deal_id");
//   }

//   // ✅ Fetch full deal from Bitrix to get OTP value
//   const dealRes = await axios.post(
//     `https://hedenahealthcare.bitrix24.in/rest/19/fx1brksmkfnt8j1x/crm.deal.get.json`,
//     { ID: deal_id }
//   );

//   const otp = dealRes.data?.result?.UF_CRM_1773809108597;
//   console.log("Completion OTP from Bitrix:", otp);

//   if (!otp) {
//     throw new ApiError(400, "Missing OTP");
//   }

//   const booking = await Booking.findOne({ deal_id: Number(deal_id) });
//   if (!booking) throw new ApiError(404, "Booking not found");

//   // ❌ Invalid OTP — update Bitrix End OTP validation Status to Invalid
//   if (booking.completion_otp !== otp) {
//     try {
//       await axios.post(
//         `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
//         {
//           ID: deal_id,
//           fields: {
//             UF_CRM_1774009860760: "Invalid" // ❌ End OTP validation Status
//           }
//         }
//       );
//     } catch (err) {
//       console.log("❌ Bitrix error on invalid:", err.message);
//     }
//     throw new ApiError(401, "Invalid Completion OTP");
//   }

//   booking.status = "completed";
//   booking.end_time = new Date();
//   await booking.save();

//   // ✅ Valid OTP — update Bitrix to Verified + mark deal WON
//   try {
//     await axios.post(
//       `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
//       {
//         ID: deal_id,
//         fields: {
//           STAGE_ID: "C1:WON",
//           UF_CRM_1774009860760: "Verified" // ✅ End OTP validation Status
//         }
//       }
//     );
//   } catch (err) {
//     console.log("❌ Bitrix error:", err.message);
//   }
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Booking from "../models/Booking.js";
import { generateOTP } from "../utils/generateOTP.js";
import axios from "axios";
import Razorpay from "razorpay";
import { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } from "../config.js";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

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
      if (status >= 400 && status < 500 && status !== 429) {
        console.log("🛑 Client error detected. Skipping retries.");
        break;
      }

      if (i < retries) {
        // Exponential backoff: 2s, 4s, 8s, 16s...
        const waitTime = Math.pow(2, i) * 1000;
        console.log(`⏳ Waiting ${waitTime / 1000}s before next attempt...`);
        await new Promise((r) => setTimeout(r, waitTime));
      }
    }
  }
  console.log(`⚠️ Bitrix update failed after ${retries} attempts`);
  return null;
};

// 1️⃣ Booking Created
export const bookingCreated = asyncHandler(async (req, res) => {
  if (req.body.auth?.application_token !== "szjlk848jizh0uhwrpcc8psyxhiy3gp6") {
    throw new ApiError(403, "Unauthorized");
  }

  const data = req.body.data?.FIELDS || req.body.data;
  console.log("bookingCreated:-", data);

  const deal_id = Number(data?.DEAL_ID || data?.ID);
  if (!deal_id) throw new ApiError(400, "deal_id required");

  // 🔥 Step 0: Check Payment Status in Bitrix before OTP generation
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/thzklp3t5hc231n4/crm.deal.get.json`,
    { ID: deal_id }
  );

  const dealFields = dealRes?.data?.result;
  const isPaid = dealFields?.UF_CRM_1773904189668 === "PAID";
  const hasPaymentId = !!dealFields?.UF_CRM_1773902195825;


  if (!isPaid || !hasPaymentId) {
    console.log(`⏹️ Skipping OTP for Deal ${deal_id}: Payment not verified (Paid: ${isPaid}, PaymentID: ${hasPaymentId})`);
    return res.json(new ApiResponse(200, { deal_id }, "Payment not completed in Bitrix, skipping OTP generation"));
  }

  // ✅ Check DB first
  const existingBooking = await Booking.findOne({ deal_id });
  if (existingBooking?.start_otp) {
    console.log(`⏭️ OTP already exists in DB for Deal ID: ${deal_id}, skipping`);
    return res.json(new ApiResponse(200, { deal_id }, "OTP already exists, skipping"));
  }

  const startOTP = generateOTP();

  await Booking.findOneAndUpdate(
    { deal_id },
    { start_otp: startOTP, status: "pending" },
    { upsert: true, new: true }
  );

  await bitrixPost(
    "https://hedenahealthcare.bitrix24.in/rest/19/ty5623yxuzz25qsj/crm.deal.update.json",
    {
      ID: deal_id,
      fields: {
        UF_CRM_1773809025643: startOTP,
        COMMENTS: `🔢 Start OTP generated for Deal ID: ${deal_id}`
      }
    }
  );

  return res.json(new ApiResponse(200, { deal_id, startOTP }, "OTP generated"));
});






// 2️⃣ Verify Start OTP
export const verifyStartOTP = asyncHandler(async (req, res) => {
  if (req.body?.auth?.application_token !== "1keq4jkmzxaw9pfjeqnp5mieb35jnilk") {
    throw new ApiError(403, "Unauthorized");
  }

  console.log("Full body:", JSON.stringify(req.body, null, 2));

  const deal_id = req.body?.data?.FIELDS?.ID
    ?? req.body?.ID
    ?? req.body?.deal_id;

  if (!deal_id || isNaN(Number(deal_id))) {
    throw new ApiError(400, "Missing or invalid deal_id");
  }

  // ✅ Fetch OTP from Database
  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status === "started" || booking.status === "completed") {
    return res.json(new ApiResponse(200, {}, "Already processed"));
  }

  // ✅ Now fetch OTP from Bitrix (Entered by user/admin)
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/kmj7mkb4krro0tke/crm.deal.get.json`,
    { ID: deal_id }
  );

  if (!dealRes) {
    throw new ApiError(503, "Bitrix server unavailable");
  }

  const enteredOtp = dealRes?.data?.result?.UF_CRM_1773809061102; // User confirmation field
  console.log("OTP Check -> DB:", booking.start_otp, "Bitrix Entered:", enteredOtp);

  if (!enteredOtp) {
    return res.json(new ApiResponse(200, {}, "OTP field is empty in Bitrix"));
  }

  // ❌ Invalid OTP
  if (booking.start_otp !== enteredOtp) {
    await bitrixPost(
      `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
      {
        ID: deal_id,
        fields: { UF_CRM_1774328840737: "Invalid" }
      }
    );
    throw new ApiError(401, "Invalid OTP");
  }

  // ✅ Valid OTP - Update DB first
  booking.status = "started";
  booking.start_time = new Date();
  booking.completion_otp_generated = false;
  await booking.save();

  console.log("✅ OTP Matched — updating Bitrix status to Verified");
  await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
    {
      ID: deal_id,
      fields: {
        UF_CRM_1774328840737: "Verified",
      }
    }
  );

  return res.json(new ApiResponse(200, {}, "Service started"));
});








// 3️⃣ Verify Completion OTP
export const verifyCompletionOTP = asyncHandler(async (req, res) => {
  console.log("verifyCompletionOTP");

  if (req.body?.auth?.application_token !== "i8z8odtqwrmzkysz56mby1yvlpnut930") {
    throw new ApiError(403, "Unauthorized");
  }

  // console.log("Full body:", JSON.stringify(req.body, null, 2));

  const deal_id = req.body?.data?.FIELDS?.ID
    ?? req.body?.ID
    ?? req.body?.deal_id;

  if (!deal_id || isNaN(Number(deal_id))) {
    throw new ApiError(400, "Missing or invalid deal_id");
  }

  // ✅ Check DB state
  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }
  if (booking.status === "completed") {
    return res.json(new ApiResponse(200, {}, "Already completed"));
  }
  if (!booking.completion_otp) {
    return res.json(new ApiResponse(200, {}, "Completion OTP not generated yet"));
  }

  // ✅ Now fetch user entered OTP from Bitrix
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/fx1brksmkfnt8j1x/crm.deal.get.json`,
    { ID: deal_id }
  );

  if (!dealRes) {
    throw new ApiError(503, "Bitrix server unavailable");
  }

  const enteredOtp = dealRes?.data?.result?.UF_CRM_1773809130950; // Completion confirmation field
  console.log("End OTP Check -> DB:", booking.completion_otp, "Bitrix Entered:", enteredOtp);

  if (!enteredOtp) {
    return res.json(new ApiResponse(200, {}, "Completion OTP field is empty in Bitrix"));
  }

  // ❌ Invalid OTP
  if (booking.completion_otp !== enteredOtp) {
    await bitrixPost(
      `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
      {
        ID: deal_id,
        fields: { UF_CRM_1774698471543: "Invalid" }
      }
    );
    throw new ApiError(401, "Invalid Completion OTP");
  }

  // ✅ Valid OTP
  booking.status = "completed";
  booking.end_time = new Date();
  await booking.save();

  await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
    {
      ID: deal_id,
      fields: {
        UF_CRM_1774698471543: "Verified",
      }
    }
  );

  return res.json(new ApiResponse(200, {}, "Work completed"));
});










export const payout = asyncHandler(async (req, res) => {
  const data = req.body.data?.FIELDS || req.body.data;
  const deal_id = Number(data?.DEAL_ID || data?.ID);

  if (!deal_id) throw new ApiError(400, "deal_id required");

  // 🔥 Fetch Deal Details from Bitrix
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/ax80r2sjrys1j62e/crm.deal.get.json`,
    { ID: deal_id }
  );

  const dealFields = dealRes?.data?.result;
  if (!dealFields) throw new ApiError(404, "Deal not found in Bitrix");

  // ✅ Check if UF_CRM_1774328872596 (Completion Confirmation) is filled/Verified
  const isVerified = dealFields?.UF_CRM_1774328872596 === "Verified";
  
  // ⛔ Preventing Infinite Loops & Duplicate Payouts in Bitrix Automation
  const currentPayoutStatus = dealFields?.UF_CRM_1774430784298; // Payout Status Field
  
  if (!isVerified) {
    console.log(`⏹️ Skipping Payout for Deal ${deal_id}: Completion not verified yet.`);
    return res.json(new ApiResponse(200, { deal_id }, "Completion not verified, skipping payout"));
  }

  // If a payout has already been created (queued, processing, processed, etc.), do NOT run payout again!
  // This prevents Bitrix UPDATE event from looping over and over causing multiple Razorpay transfers.
  if (currentPayoutStatus && currentPayoutStatus !== "Failed" && currentPayoutStatus !== "rejected") {
    console.log(`⏹️ Skipping Payout for Deal ${deal_id}: Payout is already ${currentPayoutStatus}.`);
    return res.json(new ApiResponse(200, { deal_id, currentPayoutStatus }, "Payout already processed or pending."));
  }

  // 🔥 RAZORPAY PAYOUT LOGIC
  console.log("🚀 Starting Razorpay Payout Process...");
  let payoutResponse = { status: "Pending", id: "N/A" };

  try {
    const accHolderName = dealFields?.UF_CRM_1774431276470;
    const accNumber = dealFields?.UF_CRM_1771310802862;
    const ifscCode = dealFields?.UF_CRM_1771310816536;
    const amount = Number(dealFields?.OPPORTUNITY) || 0;

    if (accHolderName && accNumber && ifscCode && amount > 0) {
      console.log(`💸 Processing Payout of ${amount} to ${accHolderName}`);

      // 1. Create Contact
      const contact = await razorpay.contacts.create({
        name: accHolderName,
        type: "vendor",
        reference_id: `DEAL_${deal_id}`,
      });

      // 2. Create Fund Account
      const fundAccount = await razorpay.fundAccounts.create({
        account_type: "bank_account",
        contact_id: contact.id,
        bank_account: {
          name: accHolderName,
          ifsc: ifscCode,
          account_number: accNumber,
        },
      });

      // 3. Create Payout
      const payoutResult = await razorpay.payouts.create({
        account_number: "2323230037328637", // ⚠️ Replace with your RazorpayX Account Number
        fund_account_id: fundAccount.id,
        amount: amount, // paise
        currency: "INR",
        mode: "IMPS",
        purpose: "payout",
        queue_if_low_balance: true,
        reference_id: `DEAL_PAYOUT_${deal_id}`,
      });

      payoutResponse = {
        status: payoutResult.status,
        id: payoutResult.id,
        utr: payoutResult.utr || "Pending",
        amount: amount,
        timestamp: new Date().toISOString(),
      };
    } else {
      payoutResponse.status = "Failed: Missing Bank Details or Amount";
    }
  } catch (error) {
    console.error("❌ Payout Error:", error.message);
    payoutResponse.status = `Error: ${error.message}`;
  }

  // ✅ Update Bitrix with Payout Results
  await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/lihlnekkbw0tc1rs/crm.deal.update.json`,
    {
      ID: deal_id,
      fields: {
        UF_CRM_1774430784298: payoutResponse.status,      // Payout Status
        UF_CRM_1774430815306: payoutResponse.id,          // Razorpay Payout ID
        UF_CRM_1774430836931: payoutResponse.utr || "",   // Payout UTR
        UF_CRM_1774430864770: payoutResponse.amount || 0, // Payout Amount
        UF_CRM_1774430925333: payoutResponse.timestamp || "", // Payout Timestamp
      },
    }
  );

  return res.json(new ApiResponse(200, { payout: payoutResponse }, "Payout process finished"));
});

