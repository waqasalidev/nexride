import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import bikeRoutes from "./routes/bikeRoutes.js";
import jetRoutes from "./routes/jetRoutes.js";
import shipRoutes from "./routes/shipRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

// Connect to Database
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/api/uploads", express.static(uploadsDir));

// Mount API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/bikes", bikeRoutes);
app.use("/api/jets", jetRoutes);
app.use("/api/ships", shipRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("NexRide API is running...");
});

// Fallback middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
