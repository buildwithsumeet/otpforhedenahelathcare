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

// export const registerHospitalFromBitrix = asyncHandler(async (req, res) => {
//   console.log("🏥 Hospital Register Webhook Hit:", JSON.stringify(req.body, null, 2));

//   // Check authentication token
//   const receivedToken = req.body?.auth?.application_token;
//   console.log("🔑 Received Token:", receivedToken);
  
//   if (receivedToken !== "2ntd3671ya04s48nrj8nzku2ikjiu45n") {
//     console.log("❌ Unauthorized: Token mismatch");
//     throw new ApiError(403, "Unauthorized");
//   }

//   const data = req.body.data?.FIELDS || req.body.data;
//   const dealId = Number(data?.DEAL_ID || data?.ID);

//   if (!dealId) {
//     throw new ApiError(400, "Deal ID required");
//   }

//   // 🔥 1. Get full deal details from Bitrix to get all custom fields
//   console.log("📡 Fetching deal details from Bitrix for Deal ID:", dealId);
  
//   let bitrixRes;
//   try {
//     bitrixRes = await axios.post(
//       "https://hedenahealthcare.bitrix24.in/rest/19/6699ol2dfrzdkogg/crm.deal.get.json",
//       { id: dealId }
//     );
//     console.log("✅ Bitrix API response received");
//   } catch (bitrixError) {
//     console.log("❌ Bitrix API Error:", bitrixError.response?.data || bitrixError.message);
//     throw new ApiError(500, `Failed to fetch deal from Bitrix: ${bitrixError.message}`);
//   }

//   const fields = bitrixRes.data?.result;
//   if (!fields) {
//     console.log("❌ No fields found in Bitrix response");
//     throw new ApiError(404, "Deal not found in Bitrix");
//   }
//   console.log("✅ Bitrix fields retrieved successfully");

//   // 🔥 Helper to ensure fields are strings (Bitrix sends [] for empty fields)
//   const getString = (val) => {
//     if (!val || (Array.isArray(val) && val.length === 0)) return "";
//     if (Array.isArray(val)) return val.join(", "); // Handle multiple values if any
//     return String(val);
//   };

//   // 🔥 2. Map Bitrix Fields to our Hospital model
//   const hospitalData = {
//     deal_id: dealId,
//     hospital_name: getString(fields.UF_CRM_1772705782),
//     hospital_type: getString(fields.UF_CRM_1771675249496),
//     other_type: getString(fields.UF_CRM_1772175049455),
//     registration_number: getString(fields.UF_CRM_1771308871019),
//     issuing_authority: getString(fields.UF_CRM_1771913938636),
//     license_expiry_date: fields.UF_CRM_1771308887647 ? new Date(fields.UF_CRM_1771308887647) : null,
//     referring_doctor_specialization: getString(fields.UF_CRM_69A6697C57CB9),
//     referral_status: getString(fields.UF_CRM_69A6707581340),
//     address: getString(fields.UF_CRM_1771662561842),
//     google_map_link: getString(fields.UF_CRM_1771308917041),
//     total_beds: Number(fields.UF_CRM_1771308932424) || 0,
//     icu_beds: Number(fields.UF_CRM_1772521915636) || 0,
//     ot_rooms: Number(fields.UF_CRM_1772521938051) || 0,
//     emergency_services_required: getString(fields.UF_CRM_1771308972396),
//     nabh_accredited: getString(fields.UF_CRM_1771308996541),
//     ayushman_bharat_empanelled: getString(fields.UF_CRM_1771309017042),
//     company_pan: getString(fields.UF_CRM_1771309063692),
//     proprietor_pan: getString(fields.UF_CRM_1771929056536),
//     gstin: getString(fields.UF_CRM_1771309077241),
//     billing_name: getString(fields.UF_CRM_1771309091874),
//     account_name: getString(fields.UF_CRM_1771915023797),
//     account_number: getString(fields.UF_CRM_1771310802862),
//     ifsc_code: getString(fields.UF_CRM_1771310816536),
//     bank_name: getString(fields.UF_CRM_1771310789378),
//     cancelled_cheque_file: getString(fields.UF_CRM_1771310831682),
//     pricing_model: getString(fields.UF_CRM_1771310901710),
//     cancellation_window: getString(fields.UF_CRM_1771310937144),
//     emergency_fee: getString(fields.UF_CRM_1771310956565),
//     replacement_policy: getString(fields.UF_CRM_1771310976000),
//     agreement_upload: getString(fields.UF_CRM_177130986853),
//   };

//   // 🔥 3. Sync with DB (Update if exists, Create if not)
//   console.log("💾 Syncing hospital data to database...");
//   let hospital = await Hospital.findOne({ deal_id: dealId });
  
//   if (!hospital) {
//     // New Hospital Registration
//     const hospitalCode = await generateCode();
//     console.log("🆕 Creating new hospital with code:", hospitalCode);
//     hospital = await Hospital.create({
//       ...hospitalData,
//       hospital_code: hospitalCode
//     });
//     console.log(`✅ New Hospital Registered: ${hospital.hospital_code}`);
//   } else {
//     // Existing Hospital Update
//     console.log("🔄 Updating existing hospital:", hospital.hospital_code);
//     hospital = await Hospital.findOneAndUpdate(
//       { deal_id: dealId }, 
//       { $set: hospitalData }, 
//       { new: true }
//     );
//     console.log(`✅ Hospital Updated: ${hospital.hospital_code}`);
//   }

//   // 🔥 4. Update Bitrix with the Hospital Code (Only if missing in Bitrix)
//   if (!fields.UF_CRM_1771311033402) {
//     console.log("📤 Sending Hospital Code to Bitrix...");
//     try {
//       await axios.post(
//         "https://hedenahealthcare.bitrix24.in/rest/19/5o7vmq1gjvfakav7/crm.deal.update.json",
//         {
//           id: dealId,
//           fields: {
//             UF_CRM_1771311033402: hospital.hospital_code
//           }
//         }
//       );
//       console.log("✅ Hospital code sent to Bitrix successfully");
//     } catch (bitrixUpdateError) {
//       console.log("⚠️ Failed to update Bitrix with hospital code:", bitrixUpdateError.message);
//       // Don't throw error - hospital was saved successfully, Bitrix update is optional
//     }
//   } else {
//     console.log("⏭️ Bitrix already has Hospital Code, skipping Bitrix update.");
//   }

//   return res.json(new ApiResponse(200, hospital, "Hospital registered/updated successfully"));
// });

// Save hospital directly (without Bitrix webhook)
export const saveHospital = asyncHandler(async (req, res) => {

 // Check authentication token
  const receivedToken = req.body?.auth?.application_token;
  console.log("🔑 Received Token:", receivedToken);
  
  if (receivedToken !== "zwo5cwvf7smoku7do3l62jzevwdyu422") {
    console.log("❌ Unauthorized: Token mismatch");
    throw new ApiError(403, "Unauthorized");
  }

  console.log("🏥 Hospital Save Request:", req.body);

  const data = req.body.data || req.body;
  const dealId = Number(data?.deal_id);

  if (!dealId) {
    throw new ApiError(400, "Deal ID is required");
  }

  // Helper to ensure fields are strings
  const getString = (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) return "";
    if (Array.isArray(val)) return val.join(", ");
    return String(val);
  };

  // Map request data to Hospital model
  const hospitalData = {
    deal_id: dealId,
    hospital_name: getString(data.hospital_name),
    hospital_type: getString(data.hospital_type),
    other_type: getString(data.other_type),
    registration_number: getString(data.registration_number),
    issuing_authority: getString(data.issuing_authority),
    license_expiry_date: data.license_expiry_date ? new Date(data.license_expiry_date) : null,
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

  // Sync with DB (Update if exists, Create if not)
  let hospital = await Hospital.findOne({ deal_id: dealId });
  
  if (!hospital) {
    // New Hospital Registration
    const hospitalCode = await generateCode();
    hospital = await Hospital.create({
      ...hospitalData,
      hospital_code: hospitalCode
    });
    console.log(`🆕 New Hospital Saved: ${hospital.hospital_code}`);
  } else {
    // Existing Hospital Update
    hospital = await Hospital.findOneAndUpdate(
      { deal_id: dealId }, 
      { $set: hospitalData }, 
      { new: true }
    );
    console.log(`🔄 Hospital Updated: ${hospital.hospital_code}`);
  }

  return res.json(new ApiResponse(200, hospital, "Hospital saved successfully"));
});
