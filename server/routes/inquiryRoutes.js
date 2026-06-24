import express from "express";
import { getInquiries, createInquiry } from "../controllers/inquiryController.js";
import { protect, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getInquiries).post(optionalProtect, createInquiry);

export default router;
