import { Router } from "express";
import { submitInquiryForm } from "../controllers/inquiry.controler.js";
import { statusUpdateInquiry } from "../controllers/inquiry.controler.js";
import { enquiryMiddleware } from "../middlewares/enquiry.middleware.js"; // Assuming you have a middleware for validation
import {verifyJWT} from "../middlewares/auth.middleware.js";
const router = Router();
console.log(router)

router.route("/demo").post(submitInquiryForm);

router.route("/status/:enquiryId").patch(verifyJWT,enquiryMiddleware,statusUpdateInquiry);


export default router;

console.log("Enquiry routes loaded successfully....");