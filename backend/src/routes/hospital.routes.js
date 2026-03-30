import { Router } from "express";
import { registerHospitalFromBitrix, saveHospital } from "../controllers/hospital.controller.js";

const router = Router();

// Bitrix Webhook: Hospital Create/Update
router.post("/register", registerHospitalFromBitrix);

// Save hospital directly (without Bitrix webhook)
router.post("/save", saveHospital);

export default router;
