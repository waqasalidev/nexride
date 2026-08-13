import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const total = await Vehicle.countDocuments();
  const cars = await Vehicle.countDocuments({ category: { $in: ["car", "CAR", "Car", "cars"] } });
  const bikes = await Vehicle.countDocuments({ category: { $in: ["bike", "BIKE", "Bike", "bikes"] } });
  const jets = await Vehicle.countDocuments({ category: { $in: ["jet", "JET", "Jet", "jets"] } });
  const ships = await Vehicle.countDocuments({ category: { $in: ["ship", "SHIP", "Ship", "ships"] } });
  const distinctCategories = await Vehicle.distinct("category");
  const sample = await Vehicle.findOne();

  console.log("=== MONGODB DIAGNOSTIC RESULTS ===");
  console.log("Total Vehicles:", total);
  console.log("Cars:", cars);
  console.log("Bikes:", bikes);
  console.log("Jets:", jets);
  console.log("Ships:", ships);
  console.log("Distinct Categories in DB:", distinctCategories);
  console.log("Sample Document:", sample ? {
    id: sample._id,
    title: sample.title,
    category: sample.category,
    brand: sample.brand,
    model: sample.model,
    price: sample.price,
    status: sample.status,
    image: sample.image,
  } : "None");

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
