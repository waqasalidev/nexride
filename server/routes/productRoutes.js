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
  getProviderStatusesController,
  testProviderConnectionController,
  fetchProviderInventoryController,
  importProductsController,
  syncProductsController,
} from "../controllers/productController.js";
import { protect, admin, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Specific non-ID routes first
router.get("/featured", getFeaturedProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);

// External API integration routes (Protected Admin)
router.get("/external/providers", protect, admin, getProviderStatusesController);
router.get("/external/status", protect, admin, getProviderStatusesController);
router.post("/external/test/:provider", protect, admin, testProviderConnectionController);
router.get("/external/:provider", protect, admin, fetchProviderInventoryController);
router.post("/import", protect, admin, importProductsController);
router.post("/sync", protect, admin, syncProductsController);

// Root route
router.route("/").get(optionalProtect, getProducts).post(protect, createProduct);

// Param route
router
  .route("/:id")
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

export default router;
