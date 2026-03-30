import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Doctor from "../models/Doctor.js";
import axios from "axios";

// ==============================
// 🔥 CONFIG
// ==============================
const BITRIX_URL = "https://hedenahealthcare.bitrix24.in/rest/19/m9l0r0xwvn9cl926/crm.contact.get.json";
const AUTH_TOKEN = "jpmvq8j7p91bk5w2djcso14thf4igztc";

// ==============================
// 🔥 DEBOUNCE CACHE
// ==============================
const processedWebhooks = new Map();

// ==============================
// 🔥 HELPERS
// ==============================
const getString = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) return val.filter(Boolean).join(", ");
  return String(val).trim();
};

const getFile = (val) => {
  if (!val) return "";
  if (Array.isArray(val)) return val[0]?.url || "";
  return val;
};

const getDate = (val) => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

// ==============================
// 🔥 GENERATE CODE
// ==============================
const generateDoctorCode = async () => {
  const count = await Doctor.countDocuments();
  return `DR-${String(count + 1).padStart(3, "0")}`;
};

// ==============================
// 🔥 MAIN FUNCTION
// ==============================
export const registerDoctorFromBitrix = asyncHandler(async (req, res) => {

  console.log("👨‍⚕️ Webhook:", req.body.event);

  // 🔐 AUTH
  if (req.body?.auth?.application_token !== AUTH_TOKEN) {
    throw new ApiError(403, "Unauthorized");
  }

  const data = req.body.data?.FIELDS || req.body.data;
  const contactId = Number(data?.ID);

  if (!contactId) {
    throw new ApiError(400, "Contact ID missing");
  }

  // ==============================
  // 🔥 DEBOUNCE
  // ==============================
  const key = `${req.body.event}_${contactId}`;
  const now = Date.now();

  if (processedWebhooks.has(key)) {
    if (now - processedWebhooks.get(key) < 5000) {
      console.log("⏳ Duplicate skipped");
      return res.json(new ApiResponse(200, null, "Duplicate ignored"));
    }
  }
  processedWebhooks.set(key, now);

  // ==============================
  // 🔥 FETCH CONTACT
  // ==============================
  const response = await axios.post(BITRIX_URL, {
    id: contactId,
    select: ["*", "UF_*"],
  });

  const f = response.data?.result;

  if (!f) throw new ApiError(404, "Contact not found");

  console.log("📦 BITRIX DATA:", f);

  // ==============================
  // 🔥 MAPPING (FINAL CORRECT)
  // ==============================
  const doctorData = {
    deal_id: contactId,

    full_name: getString(f.UF_CRM_1771929365311),
    dob: getDate(f.UF_CRM_1771929412930),
    gender: getString(f.UF_CRM_1771929485597),

    city: getString(f.UF_CRM_1772170811296),
    other_city: getString(f.UF_CRM_1772171011515),

    preferred_working_locations: getString(f.UF_CRM_1771929608333),
    emergency_contact_person: getString(f.UF_CRM_1771929635769),

    primary_qualification: getString(f.UF_CRM_1771929788628),
    qualification_certificate: getFile(f.UF_CRM_1772172294563),

    university_name: getString(f.UF_CRM_1771661652567),
    year_of_passing: getString(f.UF_CRM_1771661987818),

    specialization: getString(f.UF_CRM_1771929966211),
    other_qualification: getString(f.UF_CRM_1772172601486),

    specialization_certificate: getFile(f.UF_CRM_1772172452187),

    branch: getString(f.UF_CRM_1772510883),
    university_board: getString(f.UF_CRM_1771998862653),
    year_of_completion: getString(f.UF_CRM_1771998743837),

    medical_council_name: getString(f.UF_CRM_1771930106348),
    registration_number: getString(f.UF_CRM_1771662011139),

    registration_certificate: getFile(f.UF_CRM_1772173338),
    registration_validity: getString(f.UF_CRM_1771930261496),

    government_id_aadhaar: getString(f.UF_CRM_1772173836),
    government_id_pan: getString(f.UF_CRM_1772680990380),

    cancelled_cheque_file: getFile(f.UF_CRM_1771310831682),
    passport_photo: getFile(f.UF_CRM_1771993905808),

    total_experience_years: getString(f.UF_CRM_1771662185420),
    years_post_specialization: getString(f.UF_CRM_1771994050080),

    current_employment_status: getString(f.UF_CRM_1771994164054),
    current_hospital_attachments: getString(f.UF_CRM_1772174211),

    license_number: getString(f.UF_CRM_1772875929385),

    anaesthesiology: getString(f.UF_CRM_1772003543585),
    optional_expertise: getString(f.UF_CRM_1772003562824),

    availability_model: getString(f.UF_CRM_1772003669008),
    booking_notice_preference: getString(f.UF_CRM_1772003726187),
    emergency_on_call: getString(f.UF_CRM_1772003801842),

    expected_charges_per_case: getString(f.UF_CRM_1771996004816),
    emergency_charges: getString(f.UF_CRM_1771996029784),
    minimum_guarantee_requirement: getString(f.UF_CRM_1771996137457),

    account_number: getString(f.UF_CRM_1771310802862),
    ifsc_code: getString(f.UF_CRM_1771310816536),
    upi_id: getString(f.UF_CRM_1771996285556),

    professional_indemnity_insurance: getString(f.UF_CRM_1771996440022),
    insurance_provider: getString(f.UF_CRM_1771996479371),
    policy_number: getString(f.UF_CRM_1771996518465),

    upload_policy_copy: getFile(f.UF_CRM_1771996589920),
  };

  console.log("✅ FINAL DOCTOR DATA:", doctorData);

  // ==============================
  // 🔥 SAVE / UPDATE
  // ==============================
  let doctor = await Doctor.findOne({ deal_id: contactId });

  if (!doctor) {
    const code = await generateDoctorCode();
    doctor = await Doctor.create({ ...doctorData, doctor_code: code });
    console.log("🆕 Doctor Created:", code);
  } else {
    doctor = await Doctor.findOneAndUpdate(
      { deal_id: contactId },
      { $set: doctorData },
      { new: true }
    );
    console.log("🔄 Doctor Updated:", doctor.doctor_code);
  }

  return res.json(
    new ApiResponse(200, doctor, "Doctor synced successfully")
  );
});