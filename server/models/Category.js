import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["car", "bike", "jet", "ship"],
    },
    label: {
      type: String,
      required: true,
    },
    count: {
      type: String,
      default: "0 listings",
    },
    img: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
