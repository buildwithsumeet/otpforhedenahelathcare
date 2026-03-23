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

// ✅ Retry helper
const bitrixPost = async (url, data, retries = 3) => {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await axios.post(url, data);
      return res;
    } catch (err) {
      console.log(`❌ Bitrix attempt ${i} failed:`, err.response?.status, err.message);
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * i));
    }
  }
  console.log(`⚠️ Bitrix failed after ${retries} attempts`);
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

  // ✅ Check DB state first — skip unnecessary Bitrix calls
  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) {
    console.log(`⏭️ No booking found for Deal ID: ${deal_id}, skipping`);
    return res.json(new ApiResponse(200, {}, "No booking found, skipping"));
  }
  if (booking.status === "started" || booking.status === "completed") {
    console.log(`⏭️ Deal ${deal_id} already processed, skipping`);
    return res.json(new ApiResponse(200, {}, "Already processed, skipping"));
  }

  // ✅ Now fetch OTP from Bitrix
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/kmj7mkb4krro0tke/crm.deal.get.json`,
    { ID: deal_id }
  );

  const otp = dealRes?.data?.result?.UF_CRM_1773809025643;
  console.log("OTP from Bitrix:", otp);

  if (!otp) {
    throw new ApiError(400, "Missing OTP");
  }

  // ❌ Invalid OTP
  if (booking.start_otp !== otp) {
    await bitrixPost(
      `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
      {
        ID: deal_id,
        fields: { UF_CRM_1773809061102 : "Invalid" }
      }
    );
    throw new ApiError(401, "Invalid OTP");
  }

  booking.status = "started";
  booking.start_time = new Date();
  booking.completion_otp_generated = false;
  await booking.save();

  // ✅ Valid OTP
  console.log("✅ Valid OTP — updating Bitrix status to Verified");
  await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/7lacwaiegsop4736/crm.deal.update.json`,
    {
      ID: deal_id,
      fields: {
        UF_CRM_1773809061102 : "Verified",
        UF_CRM_1773128404473: new Date().toISOString()
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

  console.log("Full body:", JSON.stringify(req.body, null, 2));

  const deal_id = req.body?.data?.FIELDS?.ID
               ?? req.body?.ID
               ?? req.body?.deal_id;

  if (!deal_id || isNaN(Number(deal_id))) {
    throw new ApiError(400, "Missing or invalid deal_id");
  }

  // ✅ Check DB state first — skip if no completion OTP or already done
  const booking = await Booking.findOne({ deal_id: Number(deal_id) });
  if (!booking) {
    console.log(`⏭️ No booking found for Deal ID: ${deal_id}, skipping`);
    return res.json(new ApiResponse(200, {}, "No booking found, skipping"));
  }
  if (booking.status === "completed") {
    console.log(`⏭️ Deal ${deal_id} already completed, skipping`);
    return res.json(new ApiResponse(200, {}, "Already completed, skipping"));
  }
  if (!booking.completion_otp) {
    console.log(`⏭️ No completion OTP in DB for Deal ID: ${deal_id}, skipping`);
    return res.json(new ApiResponse(200, {}, "No completion OTP yet, skipping")); // ✅ stops 503
  }

  // ✅ Now fetch OTP from Bitrix
  const dealRes = await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/fx1brksmkfnt8j1x/crm.deal.get.json`,
    { ID: deal_id }
  );

  const otp = dealRes?.data?.result?.UF_CRM_1773809108597;
  console.log("Completion OTP from Bitrix:", otp);

  if (!otp) {
    throw new ApiError(400, "Missing OTP");
  }

  // ❌ Invalid OTP
  if (booking.completion_otp !== otp) {
    await bitrixPost(
      `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
      {
        ID: deal_id,
        fields: { UF_CRM_1773809130950: "Invalid" }
      }
    );
    throw new ApiError(401, "Invalid Completion OTP");
  }

  booking.status = "completed";
  booking.end_time = new Date();
  await booking.save();

  // ✅ Valid OTP
  await bitrixPost(
    `https://hedenahealthcare.bitrix24.in/rest/19/fzilqqrw8q8ykjk2/crm.deal.update.json`,
    {
      ID: deal_id,
      fields: {
        STAGE_ID: "C1:WON",
        UF_CRM_1773809130950: "Verified",
       
      }
    }
  );

  return res.json(new ApiResponse(200, {}, "Work completed"));
});