import express from "express"

import {dealCreated} from "../controllers/bitrix.controller.js"

const router = express.Router()

// Bitrix webhook endpoint
router.post("/deal-created", dealCreated)

export default router