import Brand from "../models/Brand.js";

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = async (req, res) => {
  try {
    const { name, category, logo, color } = req.body;
    const brand = await Brand.create({ name, category, logo, color });
    res.status(201).json(brand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await Brand.findByIdAndDelete(req.params.id);
      res.json({ message: "Brand removed successfully" });
    } else {
      res.status(404).json({ message: "Brand not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getBrands, createBrand, deleteBrand };
