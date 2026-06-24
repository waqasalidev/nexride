import express from "express";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(optionalProtect, getVehicles).post(protect, createVehicle);

router.route("/:id/status").put(protect, admin, updateVehicleStatus);

router
  .route("/:id")
  .get(getVehicleById)
  .put(protect, updateVehicle)
  .delete(protect, deleteVehicle);

export default router;
