import { Router } from "express";
import { registerHospitalFromBitrix } from "../controllers/hospital.controller.js";

const router = Router();

// Bitrix Webhook: Hospital Create/Update
router.post("/register", registerHospitalFromBitrix);

export default router;
