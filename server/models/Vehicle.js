import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    mileage: {
      type: String,
      default: "0 mi",
    },
    fuel: {
      type: String,
      default: "Gasoline",
    },
    category: {
      type: String,
      required: true,
      enum: ["car", "bike", "jet", "ship"],
    },
    subcategory: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    tag: {
      type: String,
      default: "",
    },
    hp: {
      type: String,
      default: "",
    },
    topSpeed: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Available",
        "Sold",
        "Featured",
        "Discounted",
        "Coming Soon"
      ],
      default: "Pending",
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
    },
    discountedPrice: {
      type: Number,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    approvalDate: {
      type: Date,
      required: false,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
export { vehicleSchema };
