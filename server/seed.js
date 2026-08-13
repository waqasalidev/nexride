import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Car from "./models/Car.js";
import Bike from "./models/Bike.js";
import Jet from "./models/Jet.js";
import Ship from "./models/Ship.js";
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected. Dropping existing collections...");

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    const targetCollections = [
      "users",
      "vehicles",
      "cars",
      "bikes",
      "jets",
      "ships",
      "brands",
      "categories",
      "favorites",
      "inquiries",
      "reviews",
    ];

    for (const name of targetCollections) {
      if (collectionNames.includes(name)) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      }
    }

    console.log("Database cleared.");

    // Create Admin User
    const adminUser = await User.create({
      name: "NexRide Admin",
      email: "admin@nexride.com",
      password: "adminpassword123", // Pre-save hook hashes this
      phone: "+1 (555) 019-2834",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "admin",
    });
    console.log("Admin user created.");

    // Seed Categories
    const categoriesData = [
      { name: "car", label: "Hypercars", count: "320+ listings", img: "https://images.unsplash.com/photo-1600706432502-75a0e2e21327?w=800&auto=format&fit=crop&q=80" },
      { name: "bike", label: "Superbikes", count: "180+ listings", img: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80" },
      { name: "jet", label: "Executive Jets", count: "45+ listings", img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80" },
      { name: "ship", label: "Luxury Ships", count: "80+ listings", img: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80" },
    ];
    await Category.insertMany(categoriesData);
    console.log("Categories seeded.");

    // Seed Brands
    const brandsData = [
      { name: "Bugatti", category: "car" },
      { name: "Ferrari", category: "car" },
      { name: "Lamborghini", category: "car" },
      { name: "Porsche", category: "car" },
      { name: "BMW", category: "car" },
      { name: "Mercedes", category: "car" },
      { name: "Audi", category: "car" },
      { name: "Tesla", category: "car" },
      { name: "McLaren", category: "car" },
      { name: "Rolls Royce", category: "car" },
      { name: "Land Rover", category: "car" },
      { name: "Toyota", category: "car" },
      { name: "Bentley", category: "car" },
      { name: "Aston Martin", category: "car" },
      { name: "Maserati", category: "car" },
      { name: "Lexus", category: "car" },
      { name: "Nissan", category: "car" },
      { name: "Chevrolet", category: "car" },
      { name: "Dodge", category: "car" },
      { name: "Koenigsegg", category: "car" },
      { name: "Pagani", category: "car" },
      { name: "Ford", category: "car" },
      { name: "Jaguar", category: "car" },
      { name: "Lucid", category: "car" },
      { name: "Rimac", category: "car" },
      { name: "Yamaha", category: "bike" },
      { name: "Honda", category: "bike" },
      { name: "Kawasaki", category: "bike" },
      { name: "Ducati", category: "bike" },
      { name: "KTM", category: "bike" },
      { name: "Suzuki", category: "bike" },
      { name: "BMW Motorrad", category: "bike" },
      { name: "Aprilia", category: "bike" },
      { name: "Triumph", category: "bike" },
      { name: "Harley Davidson", category: "bike" },
      { name: "MV Agusta", category: "bike" },
      { name: "Indian", category: "bike" },
      { name: "Husqvarna", category: "bike" },
      { name: "Moto Guzzi", category: "bike" },
      { name: "Gulfstream", category: "jet" },
      { name: "Bombardier", category: "jet" },
      { name: "Embraer", category: "jet" },
      { name: "Dassault", category: "jet" },
      { name: "Cessna", category: "jet" },
      { name: "HondaJet", category: "jet" },
      { name: "Boeing", category: "jet" },
      { name: "Airbus", category: "jet" },
      { name: "Pilatus", category: "jet" },
      { name: "Cirrus", category: "jet" },
      { name: "SyberJet", category: "jet" },
      { name: "Azimut Yachts", category: "ship" },
      { name: "Sunseeker", category: "ship" },
      { name: "Benetti", category: "ship" },
      { name: "Ferretti", category: "ship" },
      { name: "Princess Yachts", category: "ship" },
      { name: "Sunreef Yachts", category: "ship" },
      { name: "Lagoon", category: "ship" },
      { name: "Majesty Yachts", category: "ship" },
      { name: "Ocean Alexander", category: "ship" },
      { name: "Horizon", category: "ship" },
      { name: "Pershing", category: "ship" },
      { name: "Riva", category: "ship" },
      { name: "Lürssen", category: "ship" },
      { name: "Heesen", category: "ship" },
      { name: "Oceanco", category: "ship" },
      { name: "Feadship", category: "ship" },
      { name: "Amels", category: "ship" },
      { name: "Wider", category: "ship" },
      { name: "Sanlorenzo", category: "ship" },
      { name: "Custom Line", category: "ship" },
      { name: "Wally", category: "ship" },
    ];
    await Brand.insertMany(brandsData);
    console.log("Brands seeded.");

    const rawCars = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "cars.json"), "utf8"));
    const rawBikes = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "bikes.json"), "utf8"));
    const rawJets = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "jets.json"), "utf8"));
    const rawShips = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "ships.json"), "utf8"));

    const vehiclesData = [];
    rawCars.forEach(car => vehiclesData.push({ ...car, category: "car" }));
    rawBikes.forEach(bike => vehiclesData.push({ ...bike, category: "bike" }));
    rawJets.forEach(jet => vehiclesData.push({ ...jet, category: "jet" }));
    rawShips.forEach(ship => vehiclesData.push({ ...ship, category: "ship" }));

    // Deterministic shuffle to assign statuses naturally across all categories
    let seed = 42;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const shuffled = [...vehiclesData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    const total = shuffled.length;
    const soldCount = Math.round(total * 0.10);      // 10%
    const featuredCount = Math.round(total * 0.20);  // 20%
    const discountedCount = Math.round(total * 0.15);// 15%

    shuffled.forEach((v, idx) => {
      if (idx < soldCount) {
        v.status = "Sold";
        v.tag = "Sold Out";
        v.isFeatured = false;
        v.discountPercentage = 0;
      } else if (idx < soldCount + featuredCount) {
        v.status = "Featured";
        v.isFeatured = true;
        v.tag = "Featured";
        v.discountPercentage = 0;
      } else if (idx < soldCount + featuredCount + discountedCount) {
        v.status = "Discounted";
        v.isFeatured = false;
        const discounts = [10, 15, 20];
        v.discountPercentage = discounts[idx % discounts.length];
        v.tag = `${v.discountPercentage}% OFF`;
      } else {
        v.status = "Available";
        v.isFeatured = false;
        v.discountPercentage = 0;
        v.tag = "";
      }
    });

    // Insert All Vehicles to Vehicles, Cars, Bikes, Jets, Ships Collections
    for (const vData of shuffled) {
      const discount = vData.discountPercentage || 0;
      const originalPrice = vData.price;
      const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
      const isFeatured = vData.isFeatured || false;

      const title = vData.title || `${vData.year} ${vData.brand} ${vData.model}`;
      const slug = `${vData.brand}-${vData.model}-${vData.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Math.random().toString(36).substring(2, 6)}`;
      const locations = [
        { country: "United States", city: "Miami", address: "100 Ocean Drive" },
        { country: "United States", city: "Los Angeles", address: "Sunset Boulevard" },
        { country: "United Kingdom", city: "London", address: "Mayfair 42" },
        { country: "Monaco", city: "Monte Carlo", address: "Port Hercules" },
        { country: "United Arab Emirates", city: "Dubai", address: "Downtown Blvd" },
        { country: "Germany", city: "Stuttgart", address: "Porscheplatz 1" },
        { country: "Italy", city: "Maranello", address: "Via Abetone" },
      ];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const cond = vData.year >= 2024 ? "New" : "Used";
      const avail = vData.status === "Sold" ? "Sold" : "Available";

      const enrichedDoc = {
        ...vData,
        title,
        slug,
        shortDescription: vData.description ? vData.description.substring(0, 130) + "..." : "Exquisite premium vehicle listing.",
        location: loc,
        condition: cond,
        availability: avail,
        currency: "USD",
        price: discountedPrice,
        originalPrice,
        discountedPrice,
        discountPercentage: discount,
        isFeatured,
        user: adminUser._id,
        sellerId: adminUser._id,
      };

      if (vData.category === "car") {
        enrichedDoc.carSpecs = {
          engine: vData.fuel === "Electric" ? "Dual Electric Motors" : "V8 Twin-Turbo",
          transmission: "8-Speed Automatic",
          fuelType: vData.fuel || "Gasoline",
          mileage: vData.mileage || "0 mi",
          horsepower: vData.hp || "600 HP",
          drivetrain: "AWD",
          seats: 2,
        };
      } else if (vData.category === "bike") {
        enrichedDoc.bikeSpecs = {
          engine: "1,000 cc Inline-4",
          transmission: "6-Speed Quickshift",
          fuelType: vData.fuel || "Gasoline",
          mileage: vData.mileage || "0 mi",
          horsepower: vData.hp || "200 HP",
          topSpeed: vData.topSpeed || "186 mph",
        };
      } else if (vData.category === "jet") {
        enrichedDoc.jetSpecs = {
          manufacturer: vData.brand,
          aircraftModel: vData.model,
          range: "4,500 nm",
          cruisingSpeed: vData.topSpeed || "Mach 0.85",
          passengerCapacity: 12,
          engineType: "Turbofan",
        };
      } else if (vData.category === "ship") {
        enrichedDoc.shipSpecs = {
          manufacturer: vData.brand,
          vesselType: vData.subcategory || "Luxury Yacht",
          length: "85 ft",
          beam: "22 ft",
          capacity: "8 Guests",
          engineType: "Twin Marine Diesel",
          cruisingSpeed: vData.topSpeed || "24 knots",
        };
      }

      const vehicle = await Vehicle.create(enrichedDoc);

      const subDoc = {
        _id: vehicle._id,
        ...enrichedDoc,
      };

      if (vehicle.category === "car") {
        await Car.create(subDoc);
      } else if (vehicle.category === "bike") {
        await Bike.create(subDoc);
      } else if (vehicle.category === "jet") {
        await Jet.create(subDoc);
      } else if (vehicle.category === "ship") {
        await Ship.create(subDoc);
      }
    }

    console.log(`Vehicles seeded successfully: ${shuffled.length} listings total.`);
    console.log("Seeding process finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
