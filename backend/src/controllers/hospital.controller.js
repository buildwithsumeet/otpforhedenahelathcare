import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Hospital from "../models/Hospital.js";
import axios from "axios";

// Helper to generate a unique hospital code
const generateCode = async () => {
  const count = await Hospital.countDocuments();
  return `HDN-${(count + 1).toString().padStart(3, "0")}`;
};

// 🔥 Common Helper (VERY IMPORTANT)
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

// 🔥 Common Helper
const getString = (val) => {
  if (!val || (Array.isArray(val) && val.length === 0)) return "";
  if (Array.isArray(val)) return val.join(", ");
  return String(val);
};

// ==============================
// 🔥 1. BITRIX WEBHOOK HANDLER
// ==============================
export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {
  
  console.log("🔥 FULL BODY:", JSON.stringify(req.body, null, 2));

  if (req.body?.auth?.application_token !== "2ntd3671ya04s48nrj8nzku2ikjiu45n") {
    throw new ApiError(403, "Unauthorized");
  }

  const { dealId } = extractDealId(req.body);

  console.log("📌 Extracted Deal ID:", dealId);

  if (!dealId) {
    throw new ApiError(400, "Deal ID required");
  }

  // 🔥 Get full deal from Bitrix
  const bitrixRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/6699ol2dfrzdkogg/crm.deal.get.json",
    { id: dealId }
  );

  const fields = bitrixRes.data?.result;

  if (!fields) {
    throw new ApiError(404, "Deal not found in Bitrix");
  }

  // 🔥 Mapping
  const hospitalData = {
    deal_id: dealId,
    hospital_name: getString(fields.UF_CRM_1772705782),
    hospital_type: getString(fields.UF_CRM_1771675249496),
    other_type: getString(fields.UF_CRM_1772175049455),
    registration_number: getString(fields.UF_CRM_1771308871019),
    issuing_authority: getString(fields.UF_CRM_1771913938636),
    license_expiry_date: fields.UF_CRM_1771308887647
      ? new Date(fields.UF_CRM_1771308887647)
      : null,
    referring_doctor_specialization: getString(fields.UF_CRM_69A6697C57CB9),
    referral_status: getString(fields.UF_CRM_69A6707581340),
    address: getString(fields.UF_CRM_1771662561842),
    google_map_link: getString(fields.UF_CRM_1771308917041),
    total_beds: Number(fields.UF_CRM_1771308932424) || 0,
    icu_beds: Number(fields.UF_CRM_1772521915636) || 0,
    ot_rooms: Number(fields.UF_CRM_1772521938051) || 0,
    emergency_services_required: getString(fields.UF_CRM_1771308972396),
    nabh_accredited: getString(fields.UF_CRM_1771308996541),
    ayushman_bharat_empanelled: getString(fields.UF_CRM_1771309017042),
    company_pan: getString(fields.UF_CRM_1771309063692),
    proprietor_pan: getString(fields.UF_CRM_1771929056536),
    gstin: getString(fields.UF_CRM_1771309077241),
    billing_name: getString(fields.UF_CRM_1771309091874),
    account_name: getString(fields.UF_CRM_1771915023797),
    account_number: getString(fields.UF_CRM_1771310802862),
    ifsc_code: getString(fields.UF_CRM_1771310816536),
    bank_name: getString(fields.UF_CRM_1771310789378),
    cancelled_cheque_file: getString(fields.UF_CRM_1771310831682),
    pricing_model: getString(fields.UF_CRM_1771310901710),
    cancellation_window: getString(fields.UF_CRM_1771310937144),
    emergency_fee: getString(fields.UF_CRM_1771310956565),
    replacement_policy: getString(fields.UF_CRM_1771310976000),
    agreement_upload: getString(fields.UF_CRM_177130986853),
  };

  // 🔥 DB Sync
  let hospital = await Hospital.findOne({ deal_id: dealId });

  if (!hospital) {
    const hospitalCode = await generateCode();

    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode,
    });

    console.log(`🆕 New Hospital Registered: ${hospital.hospital_code}`);
  } else {
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId },
      { $set: hospitalData },
      { new: true }
    );

    console.log(`🔄 Hospital Updated: ${hospital.hospital_code}`);
  }

  // 🔥 Update Bitrix if hospital code missing
  if (!fields.UF_CRM_1771311033402) {
    console.log("📤 Updating Bitrix with Hospital Code...");

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
    new ApiResponse(200, hospital, "Hospital registered/updated successfully")
  );
});

// ==============================
// 🔥 2. DIRECT SAVE API
// ==============================
export const saveHospital = asyncHandler(async (req, res) => {

  console.log("🔥 FULL BODY:", JSON.stringify(req.body, null, 2));

  const receivedToken = req.body?.auth?.application_token;

  if (receivedToken !== "zwo5cwvf7smoku7do3l62jzevwdyu422") {
    throw new ApiError(403, "Unauthorized");
  }

  const { dealId, data } = extractDealId(req.body);

  console.log("📌 Extracted Deal ID:", dealId);

  if (!dealId) {
    throw new ApiError(400, "Deal ID is required");
  }

  // 🔥 Mapping
  const hospitalData = {
    deal_id: dealId,
    hospital_name: getString(data.hospital_name),
    hospital_type: getString(data.hospital_type),
    other_type: getString(data.other_type),
    registration_number: getString(data.registration_number),
    issuing_authority: getString(data.issuing_authority),
    license_expiry_date: data.license_expiry_date
      ? new Date(data.license_expiry_date)
      : null,
    referring_doctor_specialization: getString(data.referring_doctor_specialization),
    referral_status: getString(data.referral_status),
    address: getString(data.address),
    google_map_link: getString(data.google_map_link),
    total_beds: Number(data.total_beds) || 0,
    icu_beds: Number(data.icu_beds) || 0,
    ot_rooms: Number(data.ot_rooms) || 0,
    emergency_services_required: getString(data.emergency_services_required),
    nabh_accredited: getString(data.nabh_accredited),
    ayushman_bharat_empanelled: getString(data.ayushman_bharat_empanelled),
    company_pan: getString(data.company_pan),
    proprietor_pan: getString(data.proprietor_pan),
    gstin: getString(data.gstin),
    billing_name: getString(data.billing_name),
    account_name: getString(data.account_name),
    account_number: getString(data.account_number),
    ifsc_code: getString(data.ifsc_code),
    bank_name: getString(data.bank_name),
    cancelled_cheque_file: getString(data.cancelled_cheque_file),
    pricing_model: getString(data.pricing_model),
    cancellation_window: getString(data.cancellation_window),
    emergency_fee: getString(data.emergency_fee),
    replacement_policy: getString(data.replacement_policy),
    agreement_upload: getString(data.agreement_upload),
  };

  // 🔥 DB Sync
  let hospital = await Hospital.findOne({ deal_id: dealId });

  if (!hospital) {
    const hospitalCode = await generateCode();

    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode,
    });

    console.log(`🆕 New Hospital Saved: ${hospital.hospital_code}`);
  } else {
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId },
      { $set: hospitalData },
      { new: true }
    );

    console.log(`🔄 Hospital Updated: ${hospital.hospital_code}`);
  }

  return res.json(
    new ApiResponse(200, hospital, "Hospital saved successfully")
  );
});