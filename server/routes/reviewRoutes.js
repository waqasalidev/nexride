import express from "express";
import { getReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getReviews).post(protect, createReview);
router.route("/:id").delete(protect, deleteReview);

export default router;
