import express from "express";
import {
  getBrands,
  createBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getBrands).post(protect, admin, createBrand);
router.route("/:id").delete(protect, admin, deleteBrand);

export default router;
