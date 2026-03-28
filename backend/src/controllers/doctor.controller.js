import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import Doctor from "../models/Doctor.js"
import axios from "axios"

// Helper to generate a unique doctor code
const generateDoctorCode = async () => {
  const count = await Doctor.countDocuments();
  return `DR-${(count + 1).toString().padStart(3, '0')}`;
};

export const registerDoctorFromBitrix = asyncHandler(async (req, res) => {
  // 1. Authorization check
  if (req.body?.auth?.application_token && req.body?.auth?.application_token !== "jpmvq8j7p91bk5w2djcso14thf4igztc") {
    throw new ApiError(403, "Unauthorized Bitrix Token");
  }

  console.log("👨‍⚕️ Doctor Webhook Hit ID:", req.body.data?.FIELDS?.ID || req.body.data?.ID || req.body.data?.CONTACT_ID);

  const data = req.body.data?.FIELDS || req.body.data;
  const contactId = Number(data?.ID || data?.CONTACT_ID);
  
  if (!contactId) throw new ApiError(400, "Contact ID required");

  // Switch to Contact Get API
  const bitrixRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/7h0u2dupj7yacn4b/crm.contact.get.json",
    { id: contactId, select: ["ID", "NAME", "LAST_NAME", "UF_CRM_*"] }
  );

  if (!fields) throw new ApiError(404, "Doctor Contact not found in Bitrix");

  // Debugging: Log available fields to verify mapping
  console.log("🔍 Bitrix Data Result for Contact:", contactId);
  console.log("Keys found:", Object.keys(fields).filter(k => k.startsWith("UF_")));
  console.log("🔍 Mapping Debug - Full Name:", fields.UF_CRM_1771929365311);

  // Helper to safely handle Bitrix empty arrays/nulls
  const getString = (val) => {
    if (val === null || val === undefined || (Array.isArray(val) && val.length === 0)) return "";
    if (Array.isArray(val)) return val.join(", "); 
    return String(val).trim();
  };

  const dobStr = getString(fields.UF_CRM_1771929412930);

  const doctorData = {
    deal_id: contactId, // Mapping Contact ID to the 'deal_id' field in DB for now to keep existing schema
    full_name: getString(fields.UF_CRM_1771929365311),
    dob: (dobStr && !isNaN(new Date(dobStr).getTime())) ? new Date(dobStr) : null,
    gender: getString(fields.UF_CRM_1771929485597),
    city: getString(fields.UF_CRM_1772170811296),
    other_city: getString(fields.UF_CRM_1772171011515),
    preferred_working_locations: getString(fields.UF_CRM_1771929608333),
    emergency_contact_person: getString(fields.UF_CRM_1771929635769),
    primary_qualification: getString(fields.UF_CRM_1771929788628),
    qualification_certificate: getString(fields.UF_CRM_1772172294563),
    university_name: getString(fields.UF_CRM_1771661652567),
    year_of_passing: getString(fields.UF_CRM_1771661987818),
    specialization: getString(fields.UF_CRM_1771929966211),
    other_qualification: getString(fields.UF_CRM_1772172601486),
    specialization_certificate: getString(fields.UF_CRM_1772172452187),
    branch: getString(fields.UF_CRM_1772510883),
    university_board: getString(fields.UF_CRM_1771998862653),
    year_of_completion: getString(fields.UF_CRM_1771998743837),
    medical_council_name: getString(fields.UF_CRM_1771930106348),
    registration_number: getString(fields.UF_CRM_1771662011139),
    registration_certificate: getString(fields.UF_CRM_1772173338),
    registration_validity: getString(fields.UF_CRM_1771930261496),
    government_id_aadhaar: getString(fields.UF_CRM_1772173836),
    government_id_pan: getString(fields.UF_CRM_1772680990380),
    cancelled_cheque_file: getString(fields.UF_CRM_1771310831682),
    passport_photo: getString(fields.UF_CRM_1771993905808),
    total_experience_years: getString(fields.UF_CRM_1771662185420),
    years_post_specialization: getString(fields.UF_CRM_1771994050080),
    current_employment_status: getString(fields.UF_CRM_1771994164054),
    current_hospital_attachments: getString(fields.UF_CRM_1772174211),
    license_number: getString(fields.UF_CRM_1772875929385),
    anaesthesiology: getString(fields.UF_CRM_1772003543585),
    optional_expertise: getString(fields.UF_CRM_1772003562824),
    availability_model: getString(fields.UF_CRM_1772003669008),
    booking_notice_preference: getString(fields.UF_CRM_1772003726187),
    emergency_on_call: getString(fields.UF_CRM_1772003801842),
    expected_charges_per_case: getString(fields.UF_CRM_1771996004816),
    emergency_charges: getString(fields.UF_CRM_1771996029784),
    minimum_guarantee_requirement: getString(fields.UF_CRM_1771996137457),
    account_number: getString(fields.UF_CRM_1771310802862),
    ifsc_code: getString(fields.UF_CRM_1771310816536),
    upi_id: getString(fields.UF_CRM_1771996285556),
    professional_indemnity_insurance: getString(fields.UF_CRM_1771996440022),
    insurance_provider: getString(fields.UF_CRM_1771996479371),
    policy_number: getString(fields.UF_CRM_1771996518465),
    upload_policy_copy: getString(fields.UF_CRM_1771996589920),
  };

  console.log("Keys available in Result:", Object.keys(fields).filter(k => k.startsWith("UF_")));

  let doctor = await Doctor.findOne({ deal_id: contactId });
  if (!doctor) {
    const doctorCode = await generateDoctorCode();
    doctor = await Doctor.create({ ...doctorData, doctor_code: doctorCode });
    console.log(`🆕 Doctor (Contact) Registered: ${doctor.doctor_code}`);
  } else {
    doctor = await Doctor.findOneAndUpdate({ deal_id: contactId }, { $set: doctorData }, { new: true });
    console.log(`🔄 Doctor (Contact) Updated: ${doctor.doctor_code}`);
  }

  return res.json(new ApiResponse(200, doctor, "Doctor Contact synced successfully"));
});
