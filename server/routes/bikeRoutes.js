import express from "express";
import { getBikes } from "../controllers/vehicleController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getBikes);

export default router;
