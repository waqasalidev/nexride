import express from "express";
import {
  getFavorites,
  addFavorite,
  deleteFavorite,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All favorite routes are protected

router.route("/").get(getFavorites).post(addFavorite);
router.route("/:vehicleId").delete(deleteFavorite);

export default router;
