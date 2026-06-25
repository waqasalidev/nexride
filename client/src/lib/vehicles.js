// Fallback client-side vehicle data for offline / fallback mode
import cars from "./data/cars.json";
import bikes from "./data/bikes.json";
import jets from "./data/jets.json";
import ships from "./data/ships.json";

const combined = [];
cars.forEach((c, idx) => combined.push({ ...c, id: `car-${idx}`, category: "car" }));
bikes.forEach((b, idx) => combined.push({ ...b, id: `bike-${idx}`, category: "bike" }));
jets.forEach((j, idx) => combined.push({ ...j, id: `jet-${idx}`, category: "jet" }));
ships.forEach((s, idx) => combined.push({ ...s, id: `ship-${idx}`, category: "ship" }));

// Deterministic status distributor matching database seeding
let seed = 42;
const random = () => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const shuffled = [...combined].sort(() => random() - 0.5);

const total = shuffled.length;
const soldCount = Math.round(total * 0.10);
const featuredCount = Math.round(total * 0.20);
const discountedCount = Math.round(total * 0.15);

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

// Sync pricing fields matching database seeding logic
shuffled.forEach((v) => {
  const discount = v.discountPercentage || 0;
  const originalPrice = v.price;
  const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
  v.originalPrice = originalPrice;
  v.discountedPrice = discountedPrice;
  if (discount > 0) {
    v.price = discountedPrice;
  }
});

export const vehicles = shuffled;

export const formatPrice = (p) => p >= 1_000_000
    ? `$${(p / 1_000_000).toFixed(p % 1_000_000 === 0 ? 0 : 2)}M`
    : `$${p.toLocaleString()}`;

export const brands = {
    cars: ["Bugatti", "Ferrari", "Lamborghini", "Porsche", "BMW", "Mercedes", "Audi", "Tesla", "Bentley", "Aston Martin", "Maserati", "Lexus", "Nissan", "Chevrolet", "Dodge", "Koenigsegg", "Pagani", "Ford", "Jaguar", "Lucid", "Rimac"],
    bikes: ["Yamaha", "Honda", "Kawasaki", "Ducati", "KTM", "Suzuki", "BMW Motorrad", "Aprilia", "Triumph", "Harley Davidson", "MV Agusta", "Indian", "Husqvarna", "Moto Guzzi"],
    jets: ["Gulfstream", "Bombardier", "Embraer", "Dassault", "Cessna", "HondaJet", "Boeing", "Airbus", "Pilatus", "Cirrus", "SyberJet"],
};
