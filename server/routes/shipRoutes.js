import express from "express";
import { getShips } from "../controllers/vehicleController.js";
import { optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalProtect, getShips);

export default router;
