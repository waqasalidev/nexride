import express from "express";
import { getCars } from "../controllers/vehicleController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getCars);

export default router;
