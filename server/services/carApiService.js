// Car API Adapter (CarDatabase & CarImages APIs)

export const fetchCarDatabaseInventory = async (apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      message: "CAR_DATABASE_API_KEY is not configured.",
      provider: "carDatabase",
      category: "car",
      items: getCarDatabaseFallbackCandidates(),
    };
  }

  try {
    const res = await fetch("https://api.cardatabase.com/v1/vehicles?limit=15", {
      headers: { "X-Api-Key": apiKey, "Accept": "application/json" },
    });

    if (!res.ok) {
      return {
        success: false,
        configured: true,
        message: `CarDatabase API responded with status ${res.status}`,
        provider: "carDatabase",
        category: "car",
        items: getCarDatabaseFallbackCandidates(),
      };
    }

    const data = await res.json();
    const items = (Array.isArray(data) ? data : data.results || []).map((car) => ({
      externalId: car.id || `cardb-${car.make}-${car.model}-${car.year}`,
      source: "carDatabase",
      sourceUrl: car.url || "https://cardatabase.com",
      title: `${car.year || 2025} ${car.make || car.brand} ${car.model}`,
      category: "car",
      brand: car.make || car.brand || "Exclusive",
      model: car.model || "GT",
      year: Number(car.year) || 2025,
      price: Number(car.msrp || car.price) || 250000,
      currency: car.currency || "USD",
      location: { country: "United States", city: "Los Angeles", address: "" },
      condition: "New",
      availability: "Available",
      image: car.image || car.photoUrl || "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80",
      images: car.images || [car.image || "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80"],
      carSpecs: {
        engine: car.engine || "4.0L V8 Twin-Turbo",
        transmission: car.transmission || "8-Speed Automatic",
        fuelType: car.fuel_type || "Gasoline",
        mileage: car.mileage || "0 mi",
        horsepower: car.horsepower ? `${car.horsepower} HP` : "650 HP",
        drivetrain: car.drivetrain || "AWD",
        seats: car.seats || 2,
      },
      hp: car.horsepower ? `${car.horsepower} HP` : "650 HP",
      topSpeed: car.topSpeed || "205 mph",
      description: car.description || "High-performance precision engineered luxury car.",
    }));

    return {
      success: true,
      configured: true,
      message: "Fetched inventory from CarDatabase API",
      provider: "carDatabase",
      category: "car",
      items,
    };
  } catch (err) {
    return {
      success: false,
      configured: true,
      message: `CarDatabase API error: ${err.message}`,
      provider: "carDatabase",
      category: "car",
      items: getCarDatabaseFallbackCandidates(),
    };
  }
};

export const fetchCarImagesInventory = async (apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      message: "CAR_IMAGES_API_KEY is not configured.",
      provider: "carImages",
      category: "car",
      items: getCarImagesFallbackCandidates(),
    };
  }

  try {
    const res = await fetch("https://api.carimages.com/v1/gallery?category=supercars", {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      return {
        success: false,
        configured: true,
        message: `CarImages API responded with status ${res.status}`,
        provider: "carImages",
        category: "car",
        items: getCarImagesFallbackCandidates(),
      };
    }

    const data = await res.json();
    const items = (Array.isArray(data) ? data : data.data || []).map((imgObj) => ({
      externalId: imgObj.id || `carimg-${imgObj.brand}-${imgObj.model}`,
      source: "carImages",
      sourceUrl: imgObj.url || "https://carimages.com",
      title: `${imgObj.year || 2026} ${imgObj.brand || "Porsche"} ${imgObj.model || "911 GT3 RS"}`,
      category: "car",
      brand: imgObj.brand || "Porsche",
      model: imgObj.model || "911 GT3 RS",
      year: Number(imgObj.year) || 2026,
      price: Number(imgObj.price) || 241300,
      currency: "USD",
      location: { country: "Germany", city: "Stuttgart", address: "Porscheplatz 1" },
      condition: "New",
      availability: "Available",
      image: imgObj.highResUrl || imgObj.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
      images: [imgObj.highResUrl || imgObj.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"],
      carSpecs: {
        engine: "4.0L Naturally Aspirated Boxer-6",
        transmission: "7-Speed PDK",
        fuelType: "Gasoline",
        mileage: "0 mi",
        horsepower: "518 HP",
        drivetrain: "RWD",
        seats: 2,
      },
      hp: "518 HP",
      topSpeed: "184 mph",
      description: "Purist track-focused aerodynamics with active DRS wing.",
    }));

    return {
      success: true,
      configured: true,
      message: "Fetched high-res imagery inventory from CarImages API",
      provider: "carImages",
      category: "car",
      items,
    };
  } catch (err) {
    return {
      success: false,
      configured: true,
      message: `CarImages API error: ${err.message}`,
      provider: "carImages",
      category: "car",
      items: getCarImagesFallbackCandidates(),
    };
  }
};

const getCarDatabaseFallbackCandidates = () => [
  {
    externalId: "cardb-aston-valhalla-2026",
    source: "carDatabase",
    sourceUrl: "https://cardatabase.com/vehicles/aston-valhalla",
    title: "2026 Aston Martin Valhalla Hybrid Hypercar",
    slug: "aston-martin-valhalla-2026",
    brand: "Aston Martin",
    model: "Valhalla",
    year: 2026,
    price: 800000,
    currency: "USD",
    category: "car",
    subcategory: "Mid-Engine Hybrid",
    description: "Aston Martin's mid-engine hybrid supercar featuring a twin-turbo V8 engine coupled with dual electric motors producing 937 HP.",
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
    externalId: "cardb-mclaren-750s-2025",
    source: "carDatabase",
    sourceUrl: "https://cardatabase.com/vehicles/mclaren-750s",
    title: "2025 McLaren 750S Spider",
    slug: "mclaren-750s-spider-2025",
    brand: "McLaren",
    model: "750S Spider",
    year: 2025,
    price: 345000,
    currency: "USD",
    category: "car",
    subcategory: "Supercar Convertible",
    description: "Lighter, more powerful successor to the 720S delivering 740 HP from its 4.0-liter twin-turbo V8.",
    shortDescription: "740 HP open-top supercar performance.",
    location: { country: "United Kingdom", city: "Woking", address: "Chertsey Rd" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["MonoCell II-S Carbon Fiber Chassis", "Active Rear Wing", "Retractable Hardtop"],
    carSpecs: {
      engine: "4.0L Twin-Turbo V8",
      transmission: "7-Speed Seamless Shift Gearbox",
      fuelType: "Gasoline",
      mileage: "0 mi",
      horsepower: "740 HP",
      drivetrain: "RWD",
      seats: 2
    },
    mileage: "0 mi",
    fuel: "Gasoline",
    hp: "740 HP",
    topSpeed: "206 mph",
    status: "Available",
    isFeatured: true
  }
];

const getCarImagesFallbackCandidates = () => [
  {
    externalId: "carimg-porsche-gt3rs-2026",
    source: "carImages",
    sourceUrl: "https://carimages.com/gallery/porsche-gt3rs",
    title: "2026 Porsche 911 GT3 RS Weissach Package",
    slug: "porsche-911-gt3-rs-weissach-2026",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2026,
    price: 285000,
    currency: "USD",
    category: "car",
    subcategory: "Track Supercar",
    description: "Featuring high-downforce active aero wing, central radiator concept, and carbon fiber reinforced plastic Weissach elements.",
    shortDescription: "Road-legal motorsport weapon with active DRS.",
    location: { country: "Germany", city: "Stuttgart", address: "Porscheplatz 1" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Weissach Magnesium Wheels", "Carbon Fiber Anti-Roll Bars", "PDK 7-Speed", "Active Aero DRS"],
    carSpecs: {
      engine: "4.0L Naturally Aspirated Flat-6",
      transmission: "7-Speed Dual-Clutch PDK",
      fuelType: "Gasoline",
      mileage: "0 mi",
      horsepower: "518 HP",
      drivetrain: "RWD",
      seats: 2
    },
    mileage: "0 mi",
    fuel: "Gasoline",
    hp: "518 HP",
    topSpeed: "184 mph",
    status: "Available",
    isFeatured: true
  }
];
