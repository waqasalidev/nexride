import mongoose from "mongoose";
import { vehicleSchema } from "./Vehicle.js";

const Ship = mongoose.model("Ship", vehicleSchema, "ships");

export default Ship;
