import mongoose from "mongoose";
import { vehicleSchema } from "./Vehicle.js";

const Bike = mongoose.model("Bike", vehicleSchema, "bikes");

export default Bike;
