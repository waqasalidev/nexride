// Centralized Brand & Model Normalization Utility

const BRAND_MAPPINGS = {
  "mercedes": "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  "mercedes-benz": "Mercedes-Benz",
  "rolls royce": "Rolls-Royce",
  "rolls-royce": "Rolls-Royce",
  "harley davidson": "Harley-Davidson",
  "harley-davidson": "Harley-Davidson",
  "landrover": "Land Rover",
  "land rover": "Land Rover",
  "bmw motorrad": "BMW Motorrad",
  "bmwmotorrad": "BMW Motorrad",
  "azimut": "Azimut Yachts",
  "azimut yachts": "Azimut Yachts",
  "princess": "Princess Yachts",
  "princess yachts": "Princess Yachts",
  "majesty": "Majesty Yachts",
  "majesty yachts": "Majesty Yachts",
  "sunreef": "Sunreef Yachts",
  "sunreef yachts": "Sunreef Yachts",
  "mv agusta": "MV Agusta",
  "moto guzzi": "Moto Guzzi",
  "custom line": "Custom Line",
  "ocean alexander": "Ocean Alexander",
  "aston martin": "Aston Martin",
};

/**
 * Normalizes brand spelling and capitalization cleanly.
 */
export function normalizeBrand(rawBrand) {
  if (!rawBrand || typeof rawBrand !== "string") return "Exclusive";
  const clean = rawBrand.trim();
  const lower = clean.toLowerCase();

  if (BRAND_MAPPINGS[lower]) {
    return BRAND_MAPPINGS[lower];
  }

  // Capitalize words nicely if not mapped
  return clean.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Normalizes model and title strings to eliminate duplicate brand names inside the model or title.
 * Example:
 * Brand: "Amels", Model: "Amels 60", Title: "2023 Amels Amels 60"
 * Returns: { brand: "Amels", model: "60", title: "2023 Amels 60" }
 */
export function cleanModelAndTitle(rawBrand, rawModel, year, rawTitle) {
  const brand = normalizeBrand(rawBrand);
  let model = (rawModel || "").trim();

  // If model starts with brand name (case-insensitive), strip the duplicate brand from model
  const brandRegex = new RegExp(`^${brand.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}\\s*`, "i");
  if (brandRegex.test(model)) {
    model = model.replace(brandRegex, "").trim();
  }

  // Fallback model if empty
  if (!model) {
    model = "Series";
  }

  const yr = year || new Date().getFullYear();
  const title = `${yr} ${brand} ${model}`;

  return {
    brand,
    model,
    title,
    slug: `${brand}-${model}-${yr}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  };
}
