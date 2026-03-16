import express from "express"
import { 
 bookingCreated,
 verifyStartOTP,
 verifyCompletionOTP
} from "../controllers/otpController.js"

const router = express.Router()

router.post("/booking-created",bookingCreated)

router.post("/verify-start-otp",verifyStartOTP)

router.post("/verify-completion-otp",verifyCompletionOTP)

export default router