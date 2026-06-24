import mongoose from "mongoose";
import { vehicleSchema } from "./Vehicle.js";

const Jet = mongoose.model("Jet", vehicleSchema, "jets");

export default Jet;
