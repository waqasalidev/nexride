import Review from "../models/Review.js";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name profileImage")
      .populate("vehicle", "brand model")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      vehicle: vehicleId || undefined,
      rating,
      comment,
    });

    const populated = await Review.findById(review._id).populate("user", "name profileImage");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (review) {
      // Access check: Only Admin or the review creator can delete
      if (
        req.user.role !== "admin" &&
        review.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized to delete this review" });
      }

      await Review.findByIdAndDelete(req.params.id);
      res.json({ message: "Review removed successfully" });
    } else {
      res.status(404).json({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getReviews, createReview, deleteReview };
