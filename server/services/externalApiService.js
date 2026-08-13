import Vehicle from "../models/Vehicle.js";

// Mock external product dataset providing realistic inventory for Cars, Bikes, Jets, and Ships
// Can be extended or connected to a real external REST API (e.g. rapidapi, NHTSA, custom partner API)
const EXTERNAL_CATALOG_CANDIDATES = [
  {
    externalId: "ext-car-001",
    title: "2026 Aston Martin Valhalla Hybrid Hypercar",
    slug: "aston-martin-valhalla-2026",
    brand: "Aston Martin",
    model: "Valhalla",
    year: 2026,
    price: 800000,
    currency: "USD",
    category: "car",
    subcategory: "Mid-Engine Hybrid",
    description: "Aston Martin's revolutionary mid-engine hybrid supercar featuring a twin-turbo V8 engine coupled with dual electric motors producing 937 HP.",
    shortDescription: "Apex hybrid engineering with active aerodynamics.",
    location: { country: "United Kingdom", city: "Gaydon", address: "Banbury Road" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Active Aerodynamics", "F1 Drag Reduction System", "Full Carbon Monocoque", "Dual Clutch 8-Speed"],
    carSpecs: {
      engine: "4.0L Twin-Turbo V8 + Electric Motors",
      transmission: "8-Speed Dual-Clutch",
      fuelType: "Hybrid",
      mileage: "0 mi",
      horsepower: "937 HP",
      drivetrain: "AWD",
      seats: 2
    },
    mileage: "0 mi",
    fuel: "Hybrid",
    hp: "937 HP",
    topSpeed: "217 mph",
    status: "Available",
    isFeatured: true
  },
  {
    externalId: "ext-bike-001",
    title: "2025 Ducati Panigale V4 SP2",
    slug: "ducati-panigale-v4-sp2-2025",
    brand: "Ducati",
    model: "Panigale V4 SP2",
    year: 2025,
    price: 40500,
    currency: "USD",
    category: "bike",
    subcategory: "Track Superbike",
    description: "Numbered limited edition superbike with Winter Test livery, carbon fiber rims, STM-EVO SBK dry clutch, and Brembo Stylema R calipers.",
    shortDescription: "Track-ready numbered limited edition superbike.",
    location: { country: "Italy", city: "Bologna", address: "Via Cavalieri Ducati" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["STM-EVO SBK Dry Clutch", "Carbon Fiber Rims", "Öhlins NPX 25/30 Pressurized Fork", "Ducati Data Analyzer+"],
    bikeSpecs: {
      engine: "1,103 cc Desmosedici Stradale V4",
      transmission: "6-Speed with Ducati Quick Shift",
      fuelType: "Gasoline",
      mileage: "0 mi",
      horsepower: "215.5 HP",
      topSpeed: "186 mph"
    },
    mileage: "0 mi",
    fuel: "Gasoline",
    hp: "215.5 HP",
    topSpeed: "186 mph",
    status: "Available",
    isFeatured: true
  },
  {
    externalId: "ext-jet-001",
    title: "2025 Gulfstream G700 Executive Jet",
    slug: "gulfstream-g700-2025",
    brand: "Gulfstream",
    model: "G700",
    year: 2025,
    price: 75000000,
    currency: "USD",
    category: "jet",
    subcategory: "Ultra Long Range",
    description: "The flagship Gulfstream G700 features the industry's most spacious cabin, up to five living areas, and Rolls-Royce Pearl 700 engines.",
    shortDescription: "Ultra long-range flagship private jet.",
    location: { country: "United States", city: "Savannah", address: "Travis Field Rd" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559685303-34e8574ff053?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Symmetry Flight Deck", "Ultra-High-Speed Ka-Band Wi-Fi", "Master Suite with Shower", "Circadian Lighting System"],
    jetSpecs: {
      manufacturer: "Gulfstream Aerospace",
      aircraftModel: "G700",
      range: "7,750 nm",
      cruisingSpeed: "Mach 0.90",
      passengerCapacity: 19,
      engineType: "Rolls-Royce Pearl 700"
    },
    mileage: "0 hrs",
    fuel: "Jet Fuel",
    hp: "18,250 lbf thrust",
    topSpeed: "Mach 0.925",
    status: "Available",
    isFeatured: true
  },
  {
    externalId: "ext-ship-001",
    title: "2025 Sunseeker Ocean 182 Superyacht",
    slug: "sunseeker-ocean-182-2025",
    brand: "Sunseeker",
    model: "Ocean 182",
    year: 2025,
    price: 14200000,
    currency: "USD",
    category: "ship",
    subcategory: "Tri-Deck Superyacht",
    description: "The Sunseeker Ocean 182 offers unprecedented interior volume with a enclosed upper deck, panoramic windows, and twin MAN 2000 HP engines.",
    shortDescription: "Enclosed flybridge tri-deck luxury yacht.",
    location: { country: "Monaco", city: "Monte Carlo", address: "Port Hercules" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Enclosed Flybridge", "Hydraulic Bathing Platform", "Beach Club with BBQ", "Zero-Speed Fin Stabilizers"],
    shipSpecs: {
      manufacturer: "Sunseeker International",
      vesselType: "Tri-Deck Superyacht",
      length: "88 ft 7 in",
      beam: "23 ft 6 in",
      capacity: "10 Guests / 4 Crew",
      engineType: "Twin MAN V12-2000",
      cruisingSpeed: "27 knots"
    },
    mileage: "0 hrs",
    fuel: "Marine Diesel",
    hp: "4,000 HP Total",
    topSpeed: "27 knots",
    status: "Available",
    isFeatured: true
  }
];

// Helper to normalize external products into NexRide schema format
export const normalizeExternalProduct = (item) => {
  const brand = item.brand || "Exclusive";
  const model = item.model || "Product";
  const title = item.title || `${item.year || 2025} ${brand} ${model}`;
  const slug = item.slug || `${brand}-${model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    externalId: item.externalId || `ext-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title,
    slug,
    brand,
    model,
    year: Number(item.year) || new Date().getFullYear(),
    price: Number(item.price) || 100000,
    originalPrice: Number(item.price) || 100000,
    discountedPrice: Number(item.price) || 100000,
    currency: item.currency || "USD",
    category: item.category || "car",
    subcategory: item.subcategory || "",
    description: item.description || "",
    shortDescription: item.shortDescription || item.description?.substring(0, 120) || "",
    location: {
      country: item.location?.country || "United States",
      city: item.location?.city || "Miami",
      address: item.location?.address || "",
    },
    condition: item.condition || "New",
    availability: item.availability || "Available",
    image: item.image || "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80",
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image],
    features: Array.isArray(item.features) ? item.features : [],
    carSpecs: item.carSpecs || {},
    bikeSpecs: item.bikeSpecs || {},
    jetSpecs: item.jetSpecs || {},
    shipSpecs: item.shipSpecs || {},
    mileage: item.mileage || "0 mi",
    fuel: item.fuel || "Gasoline",
    hp: item.hp || "",
    topSpeed: item.topSpeed || "",
    status: item.status || "Available",
    isFeatured: !!item.isFeatured,
    stock: 1,
  };
};

// Fetch external candidates (filters candidates if already imported)
export const fetchExternalCandidates = async (categoryFilter = null) => {
  // If an external API URL is configured in process.env, attempt fetching from it
  let candidates = [...EXTERNAL_CATALOG_CANDIDATES];

  if (process.env.EXTERNAL_API_URL) {
    try {
      const response = await fetch(process.env.EXTERNAL_API_URL, {
        headers: process.env.EXTERNAL_API_KEY ? { "X-Api-Key": process.env.EXTERNAL_API_KEY } : {},
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          candidates = data.map(normalizeExternalProduct);
        }
      }
    } catch (err) {
      console.warn("External API call failed, using default candidate pool:", err.message);
    }
  }

  // Filter by category if requested
  if (categoryFilter && categoryFilter !== "all") {
    candidates = candidates.filter((c) => c.category === categoryFilter);
  }

  // Check MongoDB for existing externalIds
  const externalIds = candidates.map((c) => c.externalId);
  const existingDocIds = await Vehicle.find({ externalId: { $in: externalIds } }).select("externalId");
  const importedSet = new Set(existingDocIds.map((doc) => doc.externalId));

  return candidates.map((candidate) => ({
    ...candidate,
    isImported: importedSet.has(candidate.externalId),
  }));
};
