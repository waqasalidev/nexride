// Motorcycle API Adapter (CarImages Motorcycle & VehDB Motorcycle APIs)

export const fetchMotorcycleInventory = async (apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      message: "VEHDB_API_KEY is not configured.",
      provider: "vehdb",
      category: "bike",
      items: getMotorcycleFallbackCandidates(),
    };
  }

  try {
    const res = await fetch("https://api.vehdb.com/v1/motorcycles?limit=15", {
      headers: { "X-Api-Key": apiKey, "Accept": "application/json" },
    });

    if (!res.ok) {
      return {
        success: false,
        configured: true,
        message: `VehDB Motorcycle API responded with status ${res.status}`,
        provider: "vehdb",
        category: "bike",
        items: getMotorcycleFallbackCandidates(),
      };
    }

    const data = await res.json();
    const items = (Array.isArray(data) ? data : data.results || []).map((bike) => ({
      externalId: bike.id || `vehdb-bike-${bike.make}-${bike.model}`,
      source: "vehdb",
      sourceUrl: bike.url || "https://vehdb.com/bikes",
      title: `${bike.year || 2025} ${bike.make || bike.brand} ${bike.model}`,
      category: "bike",
      brand: bike.make || bike.brand || "Ducati",
      model: bike.model || "Superbike",
      year: Number(bike.year) || 2025,
      price: Number(bike.msrp || bike.price) || 35000,
      currency: bike.currency || "USD",
      location: { country: "Italy", city: "Bologna", address: "" },
      condition: "New",
      availability: "Available",
      image: bike.image || bike.photoUrl || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80",
      images: bike.images || [bike.image || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80"],
      bikeSpecs: {
        engine: bike.engine || "1,100 cc V4",
        transmission: bike.transmission || "6-Speed Quickshift",
        fuelType: bike.fuelType || "Gasoline",
        mileage: bike.mileage || "0 mi",
        horsepower: bike.horsepower ? `${bike.horsepower} HP` : "215 HP",
        topSpeed: bike.topSpeed || "186 mph",
      },
      hp: bike.horsepower ? `${bike.horsepower} HP` : "215 HP",
      topSpeed: bike.topSpeed || "186 mph",
      description: bike.description || "Precision engineered superbike.",
    }));

    return {
      success: true,
      configured: true,
      message: "Fetched motorcycle inventory from VehDB API",
      provider: "vehdb",
      category: "bike",
      items,
    };
  } catch (err) {
    return {
      success: false,
      configured: true,
      message: `VehDB API error: ${err.message}`,
      provider: "vehdb",
      category: "bike",
      items: getMotorcycleFallbackCandidates(),
    };
  }
};

const getMotorcycleFallbackCandidates = () => [
  {
    externalId: "vehdb-ducati-panigale-sp2-2025",
    source: "vehdb",
    sourceUrl: "https://vehdb.com/bikes/ducati-panigale-v4-sp2",
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
    externalId: "vehdb-bmw-m1000rr-2025",
    source: "vehdb",
    sourceUrl: "https://vehdb.com/bikes/bmw-m1000rr",
    title: "2025 BMW M 1000 RR Competition",
    slug: "bmw-m-1000-rr-competition-2025",
    brand: "BMW Motorrad",
    model: "M 1000 RR",
    year: 2025,
    price: 37990,
    currency: "USD",
    category: "bike",
    subcategory: "Homologation Superbike",
    description: "BMW M homologation superbike with M winglets, carbon aero wheel covers, and titanium valves.",
    shortDescription: "WSBK-derived M homologation superbike.",
    location: { country: "Germany", city: "Munich", address: "Petuelring 130" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["M Winglets 2.0", "M Carbon Wheels", "Pankl Titanium Connecting Rods"],
    bikeSpecs: {
      engine: "999 cc Water-cooled Inline 4-Cylinder",
      transmission: "6-Speed Constant Mesh",
      fuelType: "Gasoline",
      mileage: "0 mi",
      horsepower: "205 HP",
      topSpeed: "189 mph"
    },
    mileage: "0 mi",
    fuel: "Gasoline",
    hp: "205 HP",
    topSpeed: "189 mph",
    status: "Available",
    isFeatured: true
  }
];
