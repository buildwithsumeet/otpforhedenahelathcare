import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Enquiry from "../models/enquiry.models.js";
const submitInquiryForm = asyncHandler(async (req, res) => {
  const { name, email, message, phoneNumber} = req.body;
  console.log('Inquiry form data:', req.body); // For debugging
    if (!name || !email || !message || !phoneNumber) {  
    throw new ApiError(400, "All fields are required");
  }

  const newInquiry = new Enquiry({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    phoneNumber: phoneNumber.trim(),
    countryCode: req.body.countryCode ? req.body.countryCode.trim() : "", // Optional field
    status: "pending", // Default status
    demoApproveDate: null, // Default value
    timestamps: true, // Ensure timestamps are set
    companyName: req.body.companyName ? req.body.companyName.trim() : "" // Optional field
  });

  await newInquiry.save();

  return res.status(200).json(new ApiResponse( 200, "Inquiry submitted successfully" , {
    name: newInquiry.name,
    email: newInquiry.email,
    message: newInquiry.message,
    countryCode: newInquiry.countryCode,
    status: newInquiry.status,
    phoneNumber: newInquiry.phoneNumber,
    timestamps: newInquiry.timestamps,
    companyName: newInquiry.companyName,
  }));
});


const statusUpdateInquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  
  const { status, demoApproveDate } = req.body;
  console.log('Updating enquiry status:', req.body); // For debugging

  if (!enquiryId) {
    throw new ApiError(400, "Enquiry ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    enquiryId,
    { status, demoApproveDate },
    { new: true, runValidators: true }
  );

  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  return res.status(200).json(new ApiResponse(200, "Enquiry status updated successfully", enquiry));
});



export { submitInquiryForm , statusUpdateInquiry};

