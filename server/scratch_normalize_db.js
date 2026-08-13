import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";
import { cleanModelAndTitle } from "./utils/brandNormalizer.js";

dotenv.config();

async function runNormalizationMigration() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("=== STARTING MONGODB BRAND & MODEL DATA NORMALIZATION ===");

  const vehicles = await Vehicle.find();
  let normalizedCount = 0;
  let untouchedCount = 0;

  for (const doc of vehicles) {
    const originalBrand = doc.brand;
    const originalModel = doc.model;
    const originalTitle = doc.title;

    const cleaned = cleanModelAndTitle(doc.brand, doc.model, doc.year, doc.title);

    let changed = false;
    if (doc.brand !== cleaned.brand) {
      doc.brand = cleaned.brand;
      changed = true;
    }

    if (doc.model !== cleaned.model) {
      doc.model = cleaned.model;
      changed = true;
    }

    if (doc.title !== cleaned.title) {
      doc.title = cleaned.title;
      changed = true;
    }

    if (changed) {
      await doc.save();
      normalizedCount++;
      console.log(`[UPDATED] '${originalTitle}' -> Brand: '${cleaned.brand}', Model: '${cleaned.model}', Title: '${cleaned.title}'`);
    } else {
      untouchedCount++;
    }
  }

  console.log(`\n=== MIGRATION COMPLETE ===`);
  console.log(`Total Documents Processed: ${vehicles.length}`);
  console.log(`Documents Normalized: ${normalizedCount}`);
  console.log(`Documents Already Clean: ${untouchedCount}`);

  process.exit(0);
}

runNormalizationMigration().catch((err) => {
  console.error(err);
  process.exit(1);
});
