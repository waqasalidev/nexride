import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

async function auditVehicles() {
  await mongoose.connect(process.env.MONGODB_URI);
  const vehicles = await Vehicle.find();

  console.log("=== BRAND & MODEL AUDIT REPORT ===");
  console.log("Total Documents Audited:", vehicles.length);

  const brandCounts = {};
  const duplicateBrandInTitle = [];
  const malformedTitles = [];

  for (const v of vehicles) {
    const brand = v.brand || "Empty";
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;

    // Check if brand appears twice in title or model
    if (v.title && v.brand && v.title.toLowerCase().includes(`${v.brand.toLowerCase()} ${v.brand.toLowerCase()}`)) {
      duplicateBrandInTitle.push({ id: v._id, title: v.title, brand: v.brand, model: v.model });
    }

    if (v.model && v.brand && v.model.toLowerCase().startsWith(v.brand.toLowerCase())) {
      malformedTitles.push({ id: v._id, title: v.title, brand: v.brand, model: v.model });
    }
  }

  console.log("\nDistinct Brands Found:", brandCounts);
  console.log(`\nVehicles with Duplicate Brand in Title (${duplicateBrandInTitle.length}):`, duplicateBrandInTitle.slice(0, 5));
  console.log(`\nVehicles with Brand repeated in Model (${malformedTitles.length}):`, malformedTitles.slice(0, 5));

  process.exit(0);
}

auditVehicles().catch(console.error);
