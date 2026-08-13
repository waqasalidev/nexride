import dotenv from "dotenv";
import mongoose from "mongoose";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

// Category verified working luxury image pools
const IMAGE_POOLS = {
  car: [
    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&auto=format&fit=crop&q=80",
  ],
  bike: [
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=800&auto=format&fit=crop&q=80",
  ],
  jet: [
    "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559685303-34e8574ff053?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=800&auto=format&fit=crop&q=80",
  ],
  ship: [
    "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
  ],
};

async function fixBrokenImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("=== CHECKING AND FIXING BROKEN IMAGES IN MONGODB ===");

  const vehicles = await Vehicle.find();
  let updatedCount = 0;
  let validCount = 0;

  for (const doc of vehicles) {
    let currentImage = doc.image;
    let needsUpdate = false;

    // Check if image is missing or invalid
    if (!currentImage || typeof currentImage !== "string" || currentImage.length < 10) {
      needsUpdate = true;
    } else if (currentImage.startsWith("http")) {
      // Test URL with HEAD
      try {
        const res = await fetch(currentImage, { method: "HEAD" });
        if (res.status !== 200) {
          needsUpdate = true;
        }
      } catch (err) {
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      const pool = IMAGE_POOLS[doc.category] || IMAGE_POOLS.car;
      const newImage = pool[Math.floor(Math.random() * pool.length)];
      doc.image = newImage;
      doc.images = [newImage];
      await doc.save();
      updatedCount++;
    } else {
      validCount++;
    }
  }

  console.log(`Image migration finished! Total: ${vehicles.length}, Valid: ${validCount}, Replaced Broken: ${updatedCount}`);
  process.exit(0);
}

fixBrokenImages().catch(console.error);
