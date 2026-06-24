import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["car", "bike", "jet", "ship"],
    },
    logo: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so a brand name is unique within a category
brandSchema.index({ name: 1, category: 1 }, { unique: true });

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
