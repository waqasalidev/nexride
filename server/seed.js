import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Car from "./models/Car.js";
import Bike from "./models/Bike.js";
import Jet from "./models/Jet.js";
import Ship from "./models/Ship.js";
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";

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
      { name: "Yamaha", category: "bike" },
      { name: "Honda", category: "bike" },
      { name: "Kawasaki", category: "bike" },
      { name: "Ducati", category: "bike" },
      { name: "KTM", category: "bike" },
      { name: "Suzuki", category: "bike" },
      { name: "BMW Motorrad", category: "bike" },
      { name: "Gulfstream", category: "jet" },
      { name: "Bombardier", category: "jet" },
      { name: "Embraer", category: "jet" },
      { name: "Dassault", category: "jet" },
      { name: "Cessna", category: "jet" },
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
    ];
    await Brand.insertMany(brandsData);
    console.log("Brands seeded.");

    const vehiclesData = [];

    // --- CARS (20) ---
    const rawCars = [
      { brand: "Lamborghini", model: "Aventador SVJ", year: 2023, price: 620000, status: "Available", mileage: "3,400 mi", fuel: "Gasoline", subcategory: "Sports Car", hp: "759 HP", topSpeed: "217 mph", tag: "Rare", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?w=600&auto=format&fit=crop&q=80" },
      { brand: "Lamborghini", model: "Huracan STO", year: 2024, price: 395000, status: "Discounted", discountPercentage: 10, mileage: "1,100 mi", fuel: "Gasoline", subcategory: "Track-Focused Car", hp: "631 HP", topSpeed: "193 mph", tag: "Special Offer", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ferrari", model: "SF90 Stradale", year: 2024, price: 625000, status: "Featured", mileage: "0 mi", fuel: "Hybrid", subcategory: "Hybrid Supercar", hp: "986 HP", topSpeed: "211 mph", tag: "Featured", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ferrari", model: "812 Superfast", year: 2023, price: 420000, status: "Available", mileage: "2,100 mi", fuel: "Gasoline", subcategory: "GT Supercar", hp: "789 HP", topSpeed: "211 mph", tag: "", image: "https://images.unsplash.com/photo-1594914149222-1175653b6fbe?w=600&auto=format&fit=crop&q=80" },
      { brand: "Bugatti", model: "Chiron Mistral", year: 2024, price: 5000000, status: "Featured", mileage: "1,200 mi", fuel: "Gasoline", subcategory: "Hypercar", hp: "1,578 HP", topSpeed: "261 mph", tag: "Featured", image: "https://images.unsplash.com/photo-1600706432502-75a0e2e21327?w=600&auto=format&fit=crop&q=80" },
      { brand: "Bugatti", model: "Divo", year: 2022, price: 5800000, status: "Sold", mileage: "800 mi", fuel: "Gasoline", subcategory: "Hypercar", hp: "1,479 HP", topSpeed: "236 mph", tag: "Sold Out", image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&auto=format&fit=crop&q=80" },
      { brand: "Rolls Royce", model: "Phantom", year: 2023, price: 460000, status: "Available", mileage: "800 mi", fuel: "Gasoline", subcategory: "Luxury Sedan", hp: "563 HP", topSpeed: "155 mph", tag: "Classic", image: "https://images.unsplash.com/photo-1631248055158-edec7a3c072b?w=600&auto=format&fit=crop&q=80" },
      { brand: "Rolls Royce", model: "Cullinan Black Badge", year: 2024, price: 480000, status: "Discounted", discountPercentage: 15, mileage: "100 mi", fuel: "Gasoline", subcategory: "Luxury SUV", hp: "592 HP", topSpeed: "155 mph", tag: "Sale", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80" },
      { brand: "Mercedes", model: "AMG GT Black Series", year: 2021, price: 425000, status: "Featured", mileage: "900 mi", fuel: "Gasoline", subcategory: "Track Weapon", hp: "720 HP", topSpeed: "202 mph", tag: "Collector Item", image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&auto=format&fit=crop&q=80" },
      { brand: "Mercedes", model: "AMG G63", year: 2024, price: 190000, status: "Available", mileage: "200 mi", fuel: "Gasoline", subcategory: "Luxury SUV", hp: "577 HP", topSpeed: "137 mph", tag: "", image: "https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?w=600&auto=format&fit=crop&q=80" },
      { brand: "BMW", model: "M8 Competition", year: 2025, price: 140000, status: "Coming Soon", mileage: "0 mi", fuel: "Gasoline", subcategory: "Sports Coupe", hp: "617 HP", topSpeed: "190 mph", tag: "Reserve Now", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&auto=format&fit=crop&q=80" },
      { brand: "BMW", model: "i8 Roadster", year: 2022, price: 160000, status: "Sold", mileage: "3,800 mi", fuel: "Hybrid", subcategory: "Sports Hybrid", hp: "369 HP", topSpeed: "155 mph", tag: "Sold Out", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" },
      { brand: "Audi", model: "R8 V10 Performance", year: 2023, price: 210000, status: "Available", mileage: "1,800 mi", fuel: "Gasoline", subcategory: "Supercar", hp: "602 HP", topSpeed: "205 mph", tag: "Iconic V10", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&auto=format&fit=crop&q=80" },
      { brand: "Audi", model: "RS7 Sportback", year: 2024, price: 130000, status: "Discounted", discountPercentage: 20, mileage: "1,500 mi", fuel: "Gasoline", subcategory: "Performance Sedan", hp: "591 HP", topSpeed: "190 mph", tag: "Special Offer", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f4f?w=600&auto=format&fit=crop&q=80" },
      { brand: "Porsche", model: "911 GT3 RS", year: 2024, price: 312000, status: "Featured", mileage: "420 mi", fuel: "Gasoline", subcategory: "Track Sports Car", hp: "518 HP", topSpeed: "184 mph", tag: "Featured", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&auto=format&fit=crop&q=80" },
      { brand: "Porsche", model: "Taycan Turbo S", year: 2024, price: 195000, status: "Available", mileage: "250 mi", fuel: "Electric", subcategory: "Electric Sedan", hp: "750 HP", topSpeed: "161 mph", tag: "Zero Emission", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80" },
      { brand: "McLaren", model: "720S Spider", year: 2023, price: 310000, status: "Available", mileage: "1,400 mi", fuel: "Gasoline", subcategory: "Convertible Supercar", hp: "710 HP", topSpeed: "212 mph", tag: "", image: "https://images.unsplash.com/photo-1562591176-80db4f23b28d?w=600&auto=format&fit=crop&q=80" },
      { brand: "Tesla", model: "Model S Plaid", year: 2024, price: 90000, status: "Available", mileage: "0 mi", fuel: "Electric", subcategory: "Electric Sedan", hp: "1,020 HP", topSpeed: "200 mph", tag: "Super Fast", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&auto=format&fit=crop&q=80" },
      { brand: "Land Rover", model: "Range Rover Autobiography", year: 2024, price: 170000, status: "Coming Soon", mileage: "0 mi", fuel: "Gasoline", subcategory: "Premium Luxury SUV", hp: "523 HP", topSpeed: "155 mph", tag: "Pre-order", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80" },
      { brand: "Toyota", model: "Land Cruiser 300 ZX", year: 2023, price: 110000, status: "Sold", mileage: "5,400 mi", fuel: "Diesel", subcategory: "All-terrain SUV", hp: "304 HP", topSpeed: "130 mph", tag: "Sold Out", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80" },
    ];

    rawCars.forEach(car => {
      vehiclesData.push({ ...car, category: "car" });
    });

    // --- BIKES (10) ---
    const rawBikes = [
      { brand: "Kawasaki", model: "Ninja H2R", year: 2024, price: 56500, status: "Featured", mileage: "0 mi", fuel: "Gasoline", subcategory: "Track Bike", hp: "310 HP", topSpeed: "249 mph", tag: "Featured", image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=80" },
      { brand: "Kawasaki", model: "Ninja ZX-10R", year: 2024, price: 17700, status: "Available", mileage: "0 mi", fuel: "Gasoline", subcategory: "Superbike", hp: "200 HP", topSpeed: "186 mph", tag: "", image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&auto=format&fit=crop&q=80" },
      { brand: "Yamaha", model: "YZF-R1M", year: 2024, price: 27500, status: "Available", mileage: "120 mi", fuel: "Gasoline", subcategory: "Racing Superbike", hp: "200 HP", topSpeed: "186 mph", tag: "Carbon Edition", image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=80" },
      { brand: "Yamaha", model: "MT-09 SP", year: 2023, price: 12300, status: "Discounted", discountPercentage: 10, mileage: "800 mi", fuel: "Gasoline", subcategory: "Hyper Naked", hp: "117 HP", topSpeed: "145 mph", tag: "Special Offer", image: "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=600&auto=format&fit=crop&q=80" },
      { brand: "Honda", model: "CBR1000RR-R Fireblade", year: 2024, price: 28900, status: "Available", mileage: "50 mi", fuel: "Gasoline", subcategory: "Superbike", hp: "215 HP", topSpeed: "186 mph", tag: "", image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=600&auto=format&fit=crop&q=80" },
      { brand: "Suzuki", model: "Hayabusa", year: 2023, price: 19600, status: "Sold", mileage: "2,200 mi", fuel: "Gasoline", subcategory: "Sport Touring", hp: "190 HP", topSpeed: "186 mph", tag: "Sold Out", image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ducati", model: "Panigale V4 R", year: 2024, price: 45000, status: "Featured", mileage: "0 mi", fuel: "Gasoline", subcategory: "Exotic Superbike", hp: "240.5 HP", topSpeed: "199 mph", tag: "Featured", image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ducati", model: "Streetfighter V4 SP", year: 2023, price: 35500, status: "Discounted", discountPercentage: 15, mileage: "400 mi", fuel: "Gasoline", subcategory: "Hyper Naked", hp: "208 HP", topSpeed: "186 mph", tag: "Sale", image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&auto=format&fit=crop&q=80" },
      { brand: "BMW Motorrad", model: "S 1000 RR", year: 2024, price: 22500, status: "Available", mileage: "0 mi", fuel: "Gasoline", subcategory: "Racing Superbike", hp: "205 HP", topSpeed: "188 mph", tag: "", image: "https://images.unsplash.com/photo-1558981852-426c6c22a06a?w=600&auto=format&fit=crop&q=80" },
      { brand: "KTM", model: "Super Duke 1290 R", year: 2023, price: 21500, status: "Coming Soon", mileage: "0 mi", fuel: "Gasoline", subcategory: "Naked Beast", hp: "180 HP", topSpeed: "180 mph", tag: "Preview", image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=600&auto=format&fit=crop&q=80" },
    ];

    rawBikes.forEach(bike => {
      vehiclesData.push({ ...bike, category: "bike" });
    });

    // --- JETS (8) ---
    const rawJets = [
      { brand: "Gulfstream", model: "G700", year: 2024, price: 78000000, status: "Featured", mileage: "50 hrs", fuel: "Jet Fuel", subcategory: "Private Jet", hp: "2 Rolls-Royce Engines", topSpeed: "Mach 0.925", tag: "Featured", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=80" },
      { brand: "Gulfstream", model: "G650ER", year: 2021, price: 58000000, status: "Available", mileage: "850 hrs", fuel: "Jet Fuel", subcategory: "Executive Jet", hp: "Rolls-Royce BR725", topSpeed: "Mach 0.925", tag: "", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=80" },
      { brand: "Bombardier", model: "Global 7500", year: 2023, price: 75000000, status: "Available", mileage: "120 hrs", fuel: "Jet Fuel", subcategory: "Ultra Long-Range Jet", hp: "GE Passport", topSpeed: "Mach 0.925", tag: "", image: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=600&auto=format&fit=crop&q=80" },
      { brand: "Bombardier", model: "Challenger 650", year: 2022, price: 32000000, status: "Discounted", discountPercentage: 10, mileage: "430 hrs", fuel: "Jet Fuel", subcategory: "Large Cabin Jet", hp: "GE CF34-3B", topSpeed: "Mach 0.85", tag: "Sale", image: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=600&auto=format&fit=crop&q=80" },
      { brand: "Dassault", model: "Falcon 10X", year: 2025, price: 75000000, status: "Coming Soon", mileage: "0 hrs", fuel: "Jet Fuel", subcategory: "Ultra-Wide Jet", hp: "Rolls-Royce Pearl 10X", topSpeed: "Mach 0.925", tag: "Concept", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&auto=format&fit=crop&q=80" },
      { brand: "Dassault", model: "Falcon 8X", year: 2021, price: 59000000, status: "Sold", mileage: "940 hrs", fuel: "Jet Fuel", subcategory: "Long-Range Trijet", hp: "P&WC PW307D", topSpeed: "Mach 0.90", tag: "Sold Out", image: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=600&auto=format&fit=crop&q=80" },
      { brand: "Embraer", model: "Praetor 600", year: 2024, price: 22000000, status: "Available", mileage: "20 hrs", fuel: "Jet Fuel", subcategory: "Super-Midsize Jet", hp: "Honeywell HTF7500E", topSpeed: "Mach 0.83", tag: "", image: "https://images.unsplash.com/photo-1583000290805-06240652d824?w=600&auto=format&fit=crop&q=80" },
      { brand: "Cessna", model: "Citation Longitude", year: 2023, price: 26000000, status: "Discounted", discountPercentage: 20, mileage: "140 hrs", fuel: "Jet Fuel", subcategory: "Midsize Cabin Jet", hp: "Honeywell HTF7700L", topSpeed: "Mach 0.84", tag: "Special Offer", image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80" },
    ];

    rawJets.forEach(jet => {
      vehiclesData.push({ ...jet, category: "jet" });
    });

    // --- SHIPS & YACHTS (10) ---
    const rawShips = [
      { brand: "Azimut Yachts", model: "Grande 35M", year: 2023, price: 14500000, status: "Featured", mileage: "150 hrs", fuel: "Marine Diesel", subcategory: "Luxury Yacht", hp: "2,400 HP", topSpeed: "26 knots", tag: "Featured", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&auto=format&fit=crop&q=80" },
      { brand: "Sunseeker", model: "Predator 74", year: 2022, price: 3200000, status: "Available", mileage: "320 hrs", fuel: "Marine Diesel", subcategory: "Sport Cruiser", hp: "1,900 HP", topSpeed: "40 knots", tag: "", image: "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?w=600&auto=format&fit=crop&q=80" },
      { brand: "Princess Yachts", model: "X95", year: 2023, price: 9800000, status: "Available", mileage: "180 hrs", fuel: "Marine Diesel", subcategory: "Superyacht", hp: "3,800 HP", topSpeed: "24 knots", tag: "", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ferretti", model: "Ferretti 1000", year: 2024, price: 11500000, status: "Coming Soon", mileage: "0 hrs", fuel: "Marine Diesel", subcategory: "Flybridge Yacht", hp: "4,400 HP", topSpeed: "28 knots", tag: "New Model", image: "https://images.unsplash.com/photo-1605281317010-fe5fed93d44e?w=600&auto=format&fit=crop&q=80" },
      { brand: "Benetti", model: "Oasis 40M", year: 2023, price: 22000000, status: "Available", mileage: "140 hrs", fuel: "Marine Diesel", subcategory: "Tri-Deck Yacht", hp: "2,800 HP", topSpeed: "16 knots", tag: "", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&auto=format&fit=crop&q=80" },
      { brand: "Sunreef Yachts", model: "80 Eco Catamaran", year: 2023, price: 7500000, status: "Discounted", discountPercentage: 15, mileage: "90 hrs", fuel: "Electric", subcategory: "Sustainable Yacht", hp: "Solar Hybrid system", topSpeed: "15 knots", tag: "Sale", image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=600&auto=format&fit=crop&q=80" },
      { brand: "Lagoon", model: "Seventy 8", year: 2022, price: 4900000, status: "Sold", mileage: "560 hrs", fuel: "Marine Diesel", subcategory: "Luxury Catamaran", hp: "1,200 HP", topSpeed: "19 knots", tag: "Sold Out", image: "https://images.unsplash.com/photo-1605281317010-fe5fed93d44e?w=600&auto=format&fit=crop&q=80" },
      { brand: "Majesty Yachts", model: "Majesty 140", year: 2024, price: 18500000, status: "Featured", mileage: "60 hrs", fuel: "Marine Diesel", subcategory: "Superyacht", hp: "5,200 HP", topSpeed: "20 knots", tag: "Featured", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&auto=format&fit=crop&q=80" },
      { brand: "Ocean Alexander", model: "35R", year: 2023, price: 15200000, status: "Discounted", discountPercentage: 10, mileage: "200 hrs", fuel: "Marine Diesel", subcategory: "Tri-Deck Yacht", hp: "3,800 HP", topSpeed: "24 knots", tag: "Price Cut", image: "https://images.unsplash.com/photo-1621275471769-e6aa344546d5?w=600&auto=format&fit=crop&q=80" },
      { brand: "Horizon", model: "FD110", year: 2023, price: 13800000, status: "Available", mileage: "110 hrs", fuel: "Marine Diesel", subcategory: "Fast Displacement", hp: "3,800 HP", topSpeed: "21 knots", tag: "", image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&auto=format&fit=crop&q=80" },
    ];

    rawShips.forEach(ship => {
      vehiclesData.push({ ...ship, category: "ship" });
    });

    // Insert All Vehicles to Vehicles, Cars, Bikes, Jets, Ships Collections
    for (const vData of vehiclesData) {
      const discount = vData.discountPercentage || 0;
      const originalPrice = vData.price;
      const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
      const isFeatured = vData.status === "Featured" || vData.isFeatured === true;

      const vehicle = await Vehicle.create({
        ...vData,
        price: discountedPrice, // Active price
        originalPrice,
        discountedPrice,
        discountPercentage: discount,
        isFeatured,
        user: adminUser._id,
        sellerId: adminUser._id,
      });

      // Save in specific collection with matching ID
      const subDoc = {
        _id: vehicle._id,
        ...vData,
        price: discountedPrice,
        originalPrice,
        discountedPrice,
        discountPercentage: discount,
        isFeatured,
        user: adminUser._id,
        sellerId: adminUser._id,
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

    console.log(`Vehicles seeded successfully: ${vehiclesData.length} listings total.`);
    console.log("Seeding process finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedData();
