import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

async function runImageDiagnostic() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("=== MONGODB SAMPLE PRODUCTS & IMAGE DIAGNOSTIC ===");

  const sampleCars = await Vehicle.find({ category: "car" }).limit(2);
  const sampleBikes = await Vehicle.find({ category: "bike" }).limit(2);
  const sampleJets = await Vehicle.find({ category: "jet" }).limit(2);
  const sampleShips = await Vehicle.find({ category: "ship" }).limit(2);

  const samples = [...sampleCars, ...sampleBikes, ...sampleJets, ...sampleShips];

  console.log(`\nInspecting ${samples.length} sample documents across categories:\n`);

  for (const doc of samples) {
    console.log({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      brand: doc.brand,
      model: doc.model,
      image: doc.image,
      images: doc.images,
      thumbnail: doc.thumbnail,
      source: doc.source,
      externalId: doc.externalId,
    });
  }

  // Check HTTP status of sample images
  console.log("\n=== TESTING HTTP STATUS OF SAMPLE IMAGE URLS ===");
  for (const doc of samples) {
    const urlsToTest = [];
    if (doc.image) urlsToTest.push(doc.image);
    if (doc.images && Array.isArray(doc.images)) {
      urlsToTest.push(...doc.images);
    }
    const uniqueUrls = [...new Set(urlsToTest)].slice(0, 2);

    for (const url of uniqueUrls) {
      if (!url.startsWith("http")) {
        console.log(`[LOCAL/RELATIVE] ${url}`);
        continue;
      }
      try {
        const res = await fetch(url, { method: "HEAD" });
        const status = res.status;
        const contentType = res.headers.get("content-type");
        console.log(`URL: ${url.substring(0, 60)}... | HTTP Status: ${status} | Content-Type: ${contentType}`);
      } catch (err) {
        console.log(`URL: ${url.substring(0, 60)}... | ERROR: ${err.message}`);
      }
    }
  }

  process.exit(0);
}

runImageDiagnostic().catch((err) => {
  console.error(err);
  process.exit(1);
});
