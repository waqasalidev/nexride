import mongoose from "mongoose";
import { vehicleSchema } from "./Vehicle.js";

const Car = mongoose.model("Car", vehicleSchema, "cars");

export default Car;
