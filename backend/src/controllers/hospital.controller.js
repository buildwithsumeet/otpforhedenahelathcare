import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Hospital from "../models/Hospital.js"
import axios from "axios"

// Helper to generate a unique hospital code
const generateCode = async () => {
  const count = await Hospital.countDocuments();
  return `HDN-${(count + 1).toString().padStart(3, '0')}`;
};

export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {
  console.log("🏥 Hospital Register Webhook Hit:", req.body);

  const data = req.body.data?.FIELDS || req.body.data;
  const dealId = Number(data?.DEAL_ID || data?.ID);

  if (!dealId) {
    throw new ApiError(400, "Deal ID required");
  }

  // 🔥 1. Get full deal details from Bitrix to get all custom fields
  // Using the qu4pw71ycvsk24d1 webhook token if it's the right one, 
  // but looking at bitrix.controller.js, they use different tokens.
  // I'll use the one from bitrix.controller.js for crm.deal.get.
  const bitrixRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/6699ol2dfrzdkogg/crm.deal.get.json",
    { id: dealId }
  );

  const fields = bitrixRes.data?.result;
  if (!fields) {
    throw new ApiError(404, "Deal not found in Bitrix");
  }

  // 🔥 2. Map Bitrix Fields to our Hospital model
  const hospitalData = {
    deal_id: dealId,
    hospital_name: fields.UF_CRM_1772705782,
    hospital_type: fields.UF_CRM_1771675249496,
    other_type: fields.UF_CRM_1772175049455,
    registration_number: fields.UF_CRM_1771308871019,
    issuing_authority: fields.UF_CRM_1771913938636,
    license_expiry_date: fields.UF_CRM_1771308887647 ? new Date(fields.UF_CRM_1771308887647) : null,
    referring_doctor_specialization: fields.UF_CRM_69A6697C57CB9,
    referral_status: fields.UF_CRM_69A6707581340,
    address: fields.UF_CRM_1771662561842,
    google_map_link: fields.UF_CRM_1771308917041,
    total_beds: Number(fields.UF_CRM_1771308932424) || 0,
    icu_beds: Number(fields.UF_CRM_1772521915636) || 0,
    ot_rooms: Number(fields.UF_CRM_1772521938051) || 0,
    emergency_services_required: fields.UF_CRM_1771308972396,
    nabh_accredited: fields.UF_CRM_1771308996541,
    ayushman_bharat_empanelled: fields.UF_CRM_1771309017042,
    company_pan: fields.UF_CRM_1771309063692,
    proprietor_pan: fields.UF_CRM_1771929056536,
    gstin: fields.UF_CRM_1771309077241,
    billing_name: fields.UF_CRM_1771309091874,
    account_name: fields.UF_CRM_1771915023797,
    account_number: fields.UF_CRM_1771310802862,
    ifsc_code: fields.UF_CRM_1771310816536,
    bank_name: fields.UF_CRM_1771310789378,
    cancelled_cheque_file: fields.UF_CRM_1771310831682,
    pricing_model: fields.UF_CRM_1771310901710,
    cancellation_window: fields.UF_CRM_1771310937144,
    emergency_fee: fields.UF_CRM_1771310956565,
    replacement_policy: fields.UF_CRM_1771310976000,
    agreement_upload: fields.UF_CRM_177130986853,
  };

  // 🔥 3. Sync with DB (Update if exists, Create if not)
  let hospital = await Hospital.findOne({ deal_id: dealId });
  
  if (!hospital) {
    // New Hospital Registration
    const hospitalCode = await generateCode();
    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode
    });
    console.log(`🆕 New Hospital Registered: ${hospital.hospital_code}`);
  } else {
    // Existing Hospital Update
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId }, 
      { $set: hospitalData }, 
      { new: true }
    );
    console.log(`🔄 Hospital Updated: ${hospital.hospital_code}`);
  }

  // 🔥 4. Update Bitrix with the Hospital Code (Only if missing in Bitrix)
  if (!fields.UF_CRM_1771311033402) {
    console.log("📤 Sending Hospital Code to Bitrix...");
    await axios.post(
      "https://hedenahealthcare.bitrix24.in/rest/19/5o7vmq1gjvfakav7/crm.deal.update.json",
      {
        id: dealId,
        fields: {
          UF_CRM_1771311033402: hospital.hospital_code
        }
      }
    );
  } else {
    console.log("⏭️ Bitrix already has Hospital Code, skipping Bitrix update.");
  }

  return res.json(new ApiResponse(200, hospital, "Hospital registered/updated successfully"));
});
