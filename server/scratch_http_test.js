import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

async function runTest() {
  await mongoose.connect(process.env.MONGODB_URI);
  const server = app.listen(5099, async () => {
    console.log("Test server running on port 5099");

    try {
      const endpoints = [
        "http://localhost:5099/api/products",
        "http://localhost:5099/api/products?category=car",
        "http://localhost:5099/api/products?category=CAR",
        "http://localhost:5099/api/products?category=bike",
        "http://localhost:5099/api/products?category=jet",
        "http://localhost:5099/api/products?category=ship",
        "http://localhost:5099/api/products/category/car",
        "http://localhost:5099/api/products/category/CAR",
        "http://localhost:5099/api/products/category/bike",
        "http://localhost:5099/api/products/category/jet",
        "http://localhost:5099/api/products/category/ship",
      ];

      for (const url of endpoints) {
        const res = await fetch(url);
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : (data.products ? data.products.length : 0);
        console.log(`URL: ${url} => Status: ${res.status}, Count: ${count}, Total: ${data.totalProducts || data.total || count}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

runTest();
