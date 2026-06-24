import Favorite from "../models/Favorite.js";

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate("vehicle");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a favorite
// @route   POST /api/favorites
// @access  Private
const addFavorite = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    
    // Check if already in favorites
    const exists = await Favorite.findOne({ user: req.user._id, vehicle: vehicleId });
    if (exists) {
      return res.status(400).json({ message: "Vehicle is already in favorites" });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      vehicle: vehicleId,
    });

    const populated = await Favorite.findById(favorite._id).populate("vehicle");
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a favorite
// @route   DELETE /api/favorites/:vehicleId
// @access  Private
const deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user._id,
      vehicle: req.params.vehicleId,
    });

    if (favorite) {
      await Favorite.findByIdAndDelete(favorite._id);
      res.json({ message: "Removed from favorites" });
    } else {
      res.status(404).json({ message: "Favorite not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getFavorites, addFavorite, deleteFavorite };
