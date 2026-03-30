import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Hospital from "../models/Hospital.js";
import axios from "axios";

// ==============================
// 🔥 CONFIG
// ==============================
const BITRIX_BASE_URL = "https://hedenahealthcare.bitrix24.in/rest";
const DEAL_WEBHOOK = "19/9ouoj67qfx0d8zj2";
const UPDATE_WEBHOOK = "19/5o7vmq1gjvfakav7";
const AUTH_TOKEN = "2ntd3671ya04s48nrj8nzku2ikjiu45n";

// ==============================
// 🔥 HELPERS
// ==============================
const getString = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) return val.filter(Boolean).join(", ");
  return String(val).trim();
};

const getNumber = (val) => {
  if (!val) return 0;
  return Number(val) || 0;
};

// 🔥 Generate Hospital Code
const generateCode = async () => {
  const last = await Hospital.findOne().sort({ createdAt: -1 });

  const nextNumber = last?.hospital_code
    ? parseInt(last.hospital_code.split("-")[1]) + 1
    : 1;

  return `HDN-${String(nextNumber).padStart(3, "0")}`;
};

// 🔥 Extract Deal ID
const extractDealId = (body) => {
  const data =
    body?.data?.FIELDS ||
    body?.FIELDS ||
    body?.data ||
    body;

  return (
    Number(data?.ID) ||
    Number(data?.deal_id) ||
    Number(body?.ID) ||
    Number(body?.deal_id)
  );
};

// ==============================
// 🔥 MAIN FUNCTION
// ==============================
export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {

  console.log("🔥 WEBHOOK BODY:", JSON.stringify(req.body, null, 2));

  // 🔐 Auth
  if (req.body?.auth?.application_token !== AUTH_TOKEN) {
    throw new ApiError(403, "Unauthorized");
  }

  const dealId = extractDealId(req.body);

  if (!dealId) {
    throw new ApiError(400, "Deal ID not found");
  }

  console.log("📌 Deal ID:", dealId);

  // ==============================
  // 🔥 GET DEAL DATA
  // ==============================
  const dealRes = await axios.post(
    `${BITRIX_BASE_URL}/${DEAL_WEBHOOK}/crm.deal.get.json`,
    { id: dealId }
  );

  const deal = dealRes.data?.result;

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  console.log("📦 DEAL DATA:", JSON.stringify(deal, null, 2));

  // ==============================
  // 🔥 CHECK REQUIRED DATA
  // ==============================
  const isDataFilled =
    deal.UF_CRM_1771308871019 || // registration
    deal.UF_CRM_1771309077241 || // GST
    deal.UF_CRM_1771309063692;   // PAN

  if (!isDataFilled) {
    console.log("⏳ Skipping - No data filled yet");
    return res.json({
      success: false,
      message: "Waiting for deal update with data",
    });
  }

  // ==============================
  // 🔥 MAPPING (FINAL CORRECT)
  // ==============================
  const hospitalData = {
    deal_id: dealId,

    hospital_name: getString(deal.UF_CRM_1772705782),

    registration_number: getString(deal.UF_CRM_1771308871019),
    issuing_authority: getString(deal.UF_CRM_1771913938636),

    address: getString(deal.UF_CRM_1771662561842),
    google_map_link: getString(deal.UF_CRM_1771308917041),

    total_beds: getNumber(deal.UF_CRM_1771308932424),
    icu_beds: getNumber(deal.UF_CRM_1772521915636),
    ot_rooms: getNumber(deal.UF_CRM_1772521938051),

    nabh_accredited: getString(deal.UF_CRM_1771308996541),
    ayushman_bharat_empanelled: getString(deal.UF_CRM_1771309017042),

    company_pan: getString(deal.UF_CRM_1771309063692),
    gstin: getString(deal.UF_CRM_1771309077241),

    bank_name: getString(deal.UF_CRM_1771310789378),
    account_number: getString(deal.UF_CRM_1771310802862),
    ifsc_code: getString(deal.UF_CRM_1771310816536),

    // 🔥 FILE FIELD SAFE
    agreement_upload: Array.isArray(deal.UF_CRM_1771310986853)
      ? deal.UF_CRM_1771310986853[0]?.url || ""
      : getString(deal.UF_CRM_1771310986853),
  };

  console.log("✅ FINAL DATA:", hospitalData);

  // ==============================
  // 🔥 SAVE / UPDATE
  // ==============================
  let hospital = await Hospital.findOne({ deal_id: dealId });

  if (!hospital) {
    const hospitalCode = await generateCode();

    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode,
    });

    console.log("🆕 CREATED:", hospital.hospital_code);
  } else {
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId },
      { $set: hospitalData },
      { new: true }
    );

    console.log("🔄 UPDATED:", hospital.hospital_code);
  }

  // ==============================
  // 🔥 UPDATE DEAL (Hospital Code)
  // ==============================
  if (!deal.UF_CRM_1771311033402) {
    console.log("📤 Updating Deal with Hospital Code...");

    await axios.post(
      `${BITRIX_BASE_URL}/${UPDATE_WEBHOOK}/crm.deal.update.json`,
      {
        id: dealId,
        fields: {
          UF_CRM_1771311033402: hospital.hospital_code,
        },
      }
    );
  }

  // ==============================
  // ✅ RESPONSE
  // ==============================
  return res.json(
    new ApiResponse(200, hospital, "Hospital registered successfully")
  );
});