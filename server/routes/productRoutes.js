import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchExternalCandidatesController,
  importProductsController,
} from "../controllers/productController.js";
import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific non-ID routes first
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/external-fetch", protect, admin, fetchExternalCandidatesController);
router.post("/import", protect, admin, importProductsController);

// Root route
router.route("/").get(optionalProtect, getProducts).post(protect, createProduct);

// Param route
router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
