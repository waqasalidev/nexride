// Jet API Adapter (JetAPI & JETNET Aviation APIs)

export const fetchJetInventory = async (apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      message: "JET_API_KEY / JETNET_API_KEY is not configured.",
      provider: "jetApi",
      category: "jet",
      items: getJetFallbackCandidates(),
    };
  }

  try {
    const res = await fetch("https://api.jetapi.com/v1/aircraft?type=executive", {
      headers: { "X-Api-Key": apiKey, "Accept": "application/json" },
    });

    if (!res.ok) {
      return {
        success: false,
        configured: true,
        message: `JetAPI responded with status ${res.status}`,
        provider: "jetApi",
        category: "jet",
        items: getJetFallbackCandidates(),
      };
    }

    const data = await res.json();
    const items = (Array.isArray(data) ? data : data.aircraft || []).map((jet) => ({
      externalId: jet.id || `jetapi-${jet.manufacturer}-${jet.model}`,
      source: "jetApi",
      sourceUrl: jet.url || "https://jetapi.com",
      title: `${jet.year || 2025} ${jet.manufacturer || jet.brand} ${jet.model}`,
      category: "jet",
      brand: jet.manufacturer || jet.brand || "Gulfstream",
      model: jet.model || "G700",
      year: Number(jet.year) || 2025,
      price: Number(jet.price) || 75000000,
      currency: jet.currency || "USD",
      location: { country: "United States", city: "Savannah", address: "Travis Field Rd" },
      condition: "New",
      availability: "Available",
      image: jet.image || jet.photoUrl || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80",
      images: jet.images || [jet.image || "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&auto=format&fit=crop&q=80"],
      jetSpecs: {
        manufacturer: jet.manufacturer || "Gulfstream Aerospace",
        aircraftModel: jet.model || "G700",
        range: jet.range || "7,750 nm",
        cruisingSpeed: jet.cruisingSpeed || "Mach 0.90",
        passengerCapacity: jet.capacity || 19,
        engineType: jet.engineType || "Rolls-Royce Pearl 700",
      },
      hp: jet.thrust || "18,250 lbf thrust",
      topSpeed: jet.topSpeed || "Mach 0.925",
      description: jet.description || "Ultra long-range flagship private jet.",
    }));

    return {
      success: true,
      configured: true,
      message: "Fetched jet inventory from JetAPI",
      provider: "jetApi",
      category: "jet",
      items,
    };
  } catch (err) {
    return {
      success: false,
      configured: true,
      message: `JetAPI error: ${err.message}`,
      provider: "jetApi",
      category: "jet",
      items: getJetFallbackCandidates(),
    };
  }
};

const getJetFallbackCandidates = () => [
  {
    externalId: "jetapi-gulfstream-g700-2025",
    source: "jetApi",
    sourceUrl: "https://jetapi.com/aircraft/gulfstream-g700",
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
    externalId: "jetnet-bombardier-global7500-2025",
    source: "jetnet",
    sourceUrl: "https://jetnet.com/aircraft/global-7500",
    title: "2025 Bombardier Global 7500",
    slug: "bombardier-global-7500-2025",
    brand: "Bombardier",
    model: "Global 7500",
    year: 2025,
    price: 73000000,
    currency: "USD",
    category: "jet",
    subcategory: "Ultra Long Range",
    description: "The world's largest and longest range purpose-built business jet, featuring four true living spaces.",
    shortDescription: "Four living spaces business jet.",
    location: { country: "Canada", city: "Montreal", address: "Dorval" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Smooth Flite Touch Control", "Nuage Seat Architecture", "Full Size Kitchen"],
    jetSpecs: {
      manufacturer: "Bombardier Aviation",
      aircraftModel: "Global 7500",
      range: "7,700 nm",
      cruisingSpeed: "Mach 0.90",
      passengerCapacity: 19,
      engineType: "GE Passport"
    },
    mileage: "0 hrs",
    fuel: "Jet Fuel",
    hp: "18,920 lbf thrust",
    topSpeed: "Mach 0.925",
    status: "Available",
    isFeatured: true
  }
];
