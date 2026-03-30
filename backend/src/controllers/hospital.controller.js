import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Hospital from "../models/Hospital.js";
import axios from "axios";

// 🔥 Generate Hospital Code (safe)
const generateCode = async () => {
  const last = await Hospital.findOne().sort({ createdAt: -1 });
  const nextNumber = last
    ? parseInt(last.hospital_code.split("-")[1]) + 1
    : 1;
  return `HDN-${String(nextNumber).padStart(3, "0")}`;
};

// 🔥 Extract Deal ID (robust)
const extractDealId = (reqBody) => {
  const data =
    reqBody?.data?.FIELDS ||
    reqBody?.FIELDS ||
    reqBody?.data ||
    reqBody;

  const dealId =
    Number(data?.deal_id) ||
    Number(data?.ID) ||
    Number(reqBody?.deal_id) ||
    Number(reqBody?.ID);

  return { dealId, data };
};

// 🔥 Helper
const getString = (val) => {
  if (!val || (Array.isArray(val) && val.length === 0)) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
};

// ==============================
// 🔥 MAIN FUNCTION
// ==============================
export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {

  console.log("🔥 FULL BODY:", JSON.stringify(req.body, null, 2));

  if (req.body?.auth?.application_token !== "2ntd3671ya04s48nrj8nzku2ikjiu45n") {
    throw new ApiError(403, "Unauthorized");
  }

  const { dealId } = extractDealId(req.body);

  console.log("📌 Deal ID:", dealId);

  if (!dealId) {
    throw new ApiError(400, "Deal ID required");
  }

  // ==============================
  // 🔥 STEP 1: GET DEAL
  // ==============================
  const dealRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/9ouoj67qfx0d8zj2/crm.deal.get.json",
    { id: dealId }
  );

  const deal = dealRes.data?.result;

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  console.log("📦 Deal Data:", deal);

  const companyId = deal.COMPANY_ID;

  if (!companyId) {
    throw new ApiError(400, "No Company linked with this Deal");
  }

  console.log("🏢 Company ID:", companyId);

  // ==============================
  // 🔥 STEP 2: GET COMPANY
  // ==============================
  const companyRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/a6b9phs0wdxn2t1r/crm.company.get.json",
    { id: companyId }
  );

  const company = companyRes.data?.result;

  if (!company) {
    throw new ApiError(404, "Company not found");
  }

  console.log("📦 Company Data:", company);

  // ==============================
  // 🔥 STEP 3: MAP DATA
  // ==============================
  const hospitalData = {
    deal_id: dealId,
    company_id: companyId,

    hospital_name: getString(company.TITLE),
    registration_number: getString(company.UF_CRM_1771308871019),
    issuing_authority: getString(company.UF_CRM_1771913938636),
    gstin: getString(company.UF_CRM_1771309077241),
    company_pan: getString(company.UF_CRM_1771309063692),

    address: getString(company.ADDRESS),
    google_map_link: getString(company.UF_CRM_1771308917041),

    total_beds: Number(company.UF_CRM_1771308932424) || 0,
    icu_beds: Number(company.UF_CRM_1772521915636) || 0,
    ot_rooms: Number(company.UF_CRM_1772521938051) || 0,

    nabh_accredited: getString(company.UF_CRM_1771308996541),
    ayushman_bharat_empanelled: getString(company.UF_CRM_1771309017042),

    bank_name: getString(company.UF_CRM_1771310789378),
    account_number: getString(company.UF_CRM_1771310802862),
    ifsc_code: getString(company.UF_CRM_1771310816536),

    agreement_upload: getString(company.UF_CRM_177130986853),
  };

  // ==============================
  // 🔥 STEP 4: SAVE/UPDATE DB
  // ==============================
  let hospital = await Hospital.findOne({ deal_id: dealId });

  if (!hospital) {
    const hospitalCode = await generateCode();

    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode,
    });

    console.log("🆕 New Hospital:", hospital.hospital_code);
  } else {
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId },
      { $set: hospitalData },
      { new: true }
    );

    console.log("🔄 Updated Hospital:", hospital.hospital_code);
  }

  // ==============================
  // 🔥 STEP 5: UPDATE DEAL (Hospital Code)
  // ==============================
  if (!deal.UF_CRM_1771311033402) {
    console.log("📤 Updating Deal with Hospital Code...");

    await axios.post(
      "https://hedenahealthcare.bitrix24.in/rest/19/5o7vmq1gjvfakav7/crm.deal.update.json",
      {
        id: dealId,
        fields: {
          UF_CRM_1771311033402: hospital.hospital_code,
        },
      }
    );
  }

  return res.json(
    new ApiResponse(200, hospital, "Hospital registered successfully")
  );
});