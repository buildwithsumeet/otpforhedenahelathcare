import { Router } from "express";
import { registerDoctorFromBitrix } from "../controllers/doctor.controller.js";

const router = Router();

// Bitrix Webhook: Doctor Create/Update
router.post("/register", registerDoctorFromBitrix);

export default router;
