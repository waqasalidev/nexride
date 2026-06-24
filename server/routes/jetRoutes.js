import express from "express";
import { getJets } from "../controllers/vehicleController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getJets);

export default router;
