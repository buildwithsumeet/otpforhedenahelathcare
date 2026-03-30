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
const COMPANY_WEBHOOK = "19/a6b9phs0wdxn2t1r";
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

  const dealId =
    Number(data?.ID) ||
    Number(data?.deal_id) ||
    Number(body?.ID) ||
    Number(body?.deal_id);

  return dealId;
};

// ==============================
// 🔥 MAIN API
// ==============================
export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {

  console.log("🔥 FULL BODY:", JSON.stringify(req.body, null, 2));

  // 🔐 Auth check
  if (req.body?.auth?.application_token !== AUTH_TOKEN) {
    throw new ApiError(403, "Unauthorized");
  }

  const dealId = extractDealId(req.body);

  if (!dealId) {
    throw new ApiError(400, "Deal ID not found");
  }

  console.log("📌 Deal ID:", dealId);

  // ==============================
  // 🔥 STEP 1: GET DEAL
  // ==============================
  const dealRes = await axios.post(
    `${BITRIX_BASE_URL}/${DEAL_WEBHOOK}/crm.deal.get.json`,
    { id: dealId }
  );

  const deal = dealRes.data?.result;

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  console.log("📦 DEAL:", JSON.stringify(deal, null, 2));

  const companyId = deal.COMPANY_ID;

  if (!companyId) {
    throw new ApiError(400, "Company not linked with deal");
  }

  console.log("🏢 Company ID:", companyId);

  // ==============================
  // 🔥 STEP 2: GET COMPANY
  // ==============================
  const companyRes = await axios.post(
    `${BITRIX_BASE_URL}/${COMPANY_WEBHOOK}/crm.company.get.json`,
    { id: companyId }
  );

  const company = companyRes.data?.result;

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  console.log("📦 COMPANY:", JSON.stringify(company, null, 2));

  // ==============================
  // 🔥 STEP 3: ADDRESS FIX
  // ==============================
  const fullAddress = [
    company.ADDRESS,
    company.ADDRESS_2,
    company.ADDRESS_CITY,
    company.ADDRESS_REGION,
    company.ADDRESS_PROVINCE,
    company.ADDRESS_POSTAL_CODE,
    company.ADDRESS_COUNTRY,
  ]
    .filter(Boolean)
    .join(", ");

  // ==============================
  // 🔥 STEP 4: DATA MAPPING
  // ==============================
  const hospitalData = {
    deal_id: dealId,
    company_id: companyId,

    hospital_name: getString(company.TITLE),
    registration_number: getString(company.UF_CRM_1771308871019),
    issuing_authority: getString(company.UF_CRM_1771913938636),
    gstin: getString(company.UF_CRM_1771309077241),
    company_pan: getString(company.UF_CRM_1771309063692),

    address: fullAddress,
    google_map_link: getString(company.UF_CRM_1771308917041),

    total_beds: getNumber(company.UF_CRM_1771308932424),
    icu_beds: getNumber(company.UF_CRM_1772521915636),
    ot_rooms: getNumber(company.UF_CRM_1772521938051),

    nabh_accredited: getString(company.UF_CRM_1771308996541),
    ayushman_bharat_empanelled: getString(company.UF_CRM_1771309017042),

    bank_name: getString(company.UF_CRM_1771310789378),
    account_number: getString(company.UF_CRM_1771310802862),
    ifsc_code: getString(company.UF_CRM_1771310816536),

    agreement_upload: getString(company.UF_CRM_177130986853),
  };

  // ==============================
  // 🔥 STEP 5: SAVE / UPDATE
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
  // 🔥 STEP 6: UPDATE DEAL
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