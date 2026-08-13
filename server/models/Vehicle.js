import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
      index: true,
    },
    brand: {
      type: String,
      required: true,
      index: true,
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
      index: true,
    },
    currency: {
      type: String,
      default: "USD",
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
      index: true,
    },
    subcategory: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    location: {
      country: { type: String, default: "United States" },
      city: { type: String, default: "Miami" },
      address: { type: String, default: "" },
    },
    condition: {
      type: String,
      enum: ["New", "Used", "Refurbished"],
      default: "Used",
    },
    availability: {
      type: String,
      enum: ["Available", "Sold", "Reserved"],
      default: "Available",
      index: true,
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
    // Category-specific specifications
    carSpecs: {
      engine: { type: String, default: "" },
      transmission: { type: String, default: "" },
      fuelType: { type: String, default: "" },
      mileage: { type: String, default: "" },
      horsepower: { type: String, default: "" },
      drivetrain: { type: String, default: "" },
      seats: { type: Number, default: 2 },
    },
    bikeSpecs: {
      engine: { type: String, default: "" },
      transmission: { type: String, default: "" },
      fuelType: { type: String, default: "" },
      mileage: { type: String, default: "" },
      horsepower: { type: String, default: "" },
      topSpeed: { type: String, default: "" },
    },
    jetSpecs: {
      manufacturer: { type: String, default: "" },
      aircraftModel: { type: String, default: "" },
      range: { type: String, default: "" },
      cruisingSpeed: { type: String, default: "" },
      passengerCapacity: { type: Number, default: 8 },
      engineType: { type: String, default: "" },
    },
    shipSpecs: {
      manufacturer: { type: String, default: "" },
      vesselType: { type: String, default: "" },
      length: { type: String, default: "" },
      beam: { type: String, default: "" },
      capacity: { type: String, default: "" },
      engineType: { type: String, default: "" },
      cruisingSpeed: { type: String, default: "" },
    },
    externalId: {
      type: String,
      sparse: true,
      index: true,
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
        "Coming Soon",
      ],
      default: "Pending",
      index: true,
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
      index: true,
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

vehicleSchema.index({ category: 1, status: 1 });
vehicleSchema.index({ brand: 1, category: 1 });
vehicleSchema.index({ createdAt: -1 });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
export { vehicleSchema };

