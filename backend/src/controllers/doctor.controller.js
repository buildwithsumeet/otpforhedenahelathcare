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
  console.log("👨‍⚕️ Doctor Register Webhook Hit:", req.body);

  const data = req.body.data?.FIELDS || req.body.data;
  const dealId = Number(data?.DEAL_ID || data?.ID);

  if (!dealId) {
    throw new ApiError(400, "Deal ID required");
  }

  // 🔥 1. Get full deal details from Bitrix
  const bitrixRes = await axios.post(
    "https://hedenahealthcare.bitrix24.in/rest/19/6699ol2dfrzdkogg/crm.deal.get.json",
    { id: dealId }
  );

  const fields = bitrixRes.data?.result;
  if (!fields) {
    throw new ApiError(404, "Doctor Deal not found in Bitrix");
  }

  // 🔥 2. Map Bitrix Fields to our Doctor model
  const doctorData = {
    deal_id: dealId,
    full_name: fields.UF_CRM_1771929365311,
    dob: fields.UF_CRM_1771929412930 ? new Date(fields.UF_CRM_1771929412930) : null,
    gender: fields.UF_CRM_1771929485597,
    city: fields.UF_CRM_1772170811296,
    other_city: fields.UF_CRM_1772171011515,
    preferred_working_locations: fields.UF_CRM_1771929608333,
    emergency_contact_person: fields.UF_CRM_1771929635769,
    primary_qualification: fields.UF_CRM_1771929788628,
    qualification_certificate: fields.UF_CRM_1772172294563,
    university_name: fields.UF_CRM_1771661652567,
    year_of_passing: fields.UF_CRM_1771661987818,
    specialization: fields.UF_CRM_1771929966211,
    other_qualification: fields.UF_CRM_1772172601486,
    specialization_certificate: fields.UF_CRM_1772172452187,
    branch: fields.UF_CRM_1772510883,
    university_board: fields.UF_CRM_1771998862653,
    year_of_completion: fields.UF_CRM_1771998743837,
    medical_council_name: fields.UF_CRM_1771930106348,
    registration_number: fields.UF_CRM_1771662011139,
    registration_certificate: fields.UF_CRM_1772173338,
    registration_validity: fields.UF_CRM_1771930261496,
    government_id_aadhaar: fields.UF_CRM_1772173836,
    government_id_pan: fields.UF_CRM_1772680990380,
    cancelled_cheque_file: fields.UF_CRM_1771310831682,
    passport_photo: fields.UF_CRM_1771993905808,
    total_experience_years: fields.UF_CRM_1771662185420,
    years_post_specialization: fields.UF_CRM_1771994050080,
    current_employment_status: fields.UF_CRM_1771994164054,
    current_hospital_attachments: fields.UF_CRM_1772174211,
    license_number: fields.UF_CRM_1772875929385,
    anaesthesiology: fields.UF_CRM_1772003543585,
    optional_expertise: fields.UF_CRM_1772003562824,
    availability_model: fields.UF_CRM_1772003669008,
    booking_notice_preference: fields.UF_CRM_1772003726187,
    emergency_on_call: fields.UF_CRM_1772003801842,
    expected_charges_per_case: fields.UF_CRM_1771996004816,
    emergency_charges: fields.UF_CRM_1771996029784,
    minimum_guarantee_requirement: fields.UF_CRM_1771996137457,
    account_number: fields.UF_CRM_1771310802862,
    ifsc_code: fields.UF_CRM_1771310816536,
    upi_id: fields.UF_CRM_1771996285556,
    professional_indemnity_insurance: fields.UF_CRM_1771996440022,
    insurance_provider: fields.UF_CRM_1771996479371,
    policy_number: fields.UF_CRM_1771996518465,
    upload_policy_copy: fields.UF_CRM_1771996589920,
  };

  // 🔥 3. Sync with DB (Update if exists, Create if not)
  let doctor = await Doctor.findOne({ deal_id: dealId });
  
  if (!doctor) {
    // New Doctor Registration
    const doctorCode = await generateDoctorCode();
    doctor = await Doctor.create({
      ...doctorData,
      doctor_code: doctorCode
    });
    console.log(`🆕 New Doctor Registered: ${doctor.doctor_code}`);
    
    // Note: If you have a specific field for Doctor Code in Bitrix, add it here like Hospital.
  } else {
    // Existing Doctor Update - Update all fields
    doctor = await Doctor.findOneAndUpdate(
      { deal_id: dealId }, 
      { $set: doctorData }, 
      { new: true }
    );
    console.log(`🔄 Doctor Updated: ${doctor.doctor_code}`);
  }

  return res.json(new ApiResponse(200, doctor, "Doctor registered/updated successfully"));
});
