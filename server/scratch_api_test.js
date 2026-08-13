import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

async function testQueryFilters() {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log("=== API QUERY CONTROLLER SIMULATION TEST ===");

  // Case 1: Category filter = "car"
  const carsRaw = await Vehicle.find({ category: "car" }).limit(5);
  console.log("Category='car' count:", carsRaw.length);

  // Case 2: Category filter = "CAR" (uppercase test)
  const carsUpper = await Vehicle.find({ category: new RegExp("^car$", "i") }).limit(5);
  console.log("Category='CAR' (case insensitive regex) count:", carsUpper.length);

  // Case 3: Category filter = "bike"
  const bikesRaw = await Vehicle.find({ category: "bike" }).limit(5);
  console.log("Category='bike' count:", bikesRaw.length);

  // Case 4: Category filter = "jet"
  const jetsRaw = await Vehicle.find({ category: "jet" }).limit(5);
  console.log("Category='jet' count:", jetsRaw.length);

  // Case 5: Category filter = "ship"
  const shipsRaw = await Vehicle.find({ category: "ship" }).limit(5);
  console.log("Category='ship' count:", shipsRaw.length);

  // Case 6: Status filtering check
  const statusCounts = await Vehicle.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  console.log("Document counts by status:", statusCounts);

  // Case 7: Availability filtering check
  const availCounts = await Vehicle.aggregate([
    { $group: { _id: "$availability", count: { $sum: 1 } } }
  ]);
  console.log("Document counts by availability:", availCounts);

  process.exit(0);
}

testQueryFilters().catch(console.error);
