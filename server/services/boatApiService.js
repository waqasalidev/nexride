// Boat API Adapter (Boats.com & VehDB Boats APIs)

export const fetchBoatInventory = async (apiKey) => {
  if (!apiKey) {
    return {
      success: false,
      configured: false,
      message: "BOATS_API_KEY is not configured.",
      provider: "boats",
      category: "ship",
      items: getBoatFallbackCandidates(),
    };
  }

  try {
    const res = await fetch("https://api.boats.com/v1/inventory?type=yacht", {
      headers: { "X-Api-Key": apiKey, "Accept": "application/json" },
    });

    if (!res.ok) {
      return {
        success: false,
        configured: true,
        message: `Boats.com API responded with status ${res.status}`,
        provider: "boats",
        category: "ship",
        items: getBoatFallbackCandidates(),
      };
    }

    const data = await res.json();
    const items = (Array.isArray(data) ? data : data.boats || []).map((ship) => ({
      externalId: ship.id || `boats-${ship.builder}-${ship.model}`,
      source: "boats",
      sourceUrl: ship.url || "https://boats.com",
      title: `${ship.year || 2025} ${ship.builder || ship.brand} ${ship.model}`,
      category: "ship",
      brand: ship.builder || ship.brand || "Sunseeker",
      model: ship.model || "Ocean 182",
      year: Number(ship.year) || 2025,
      price: Number(ship.price) || 14200000,
      currency: ship.currency || "USD",
      location: { country: "Monaco", city: "Monte Carlo", address: "Port Hercules" },
      condition: "New",
      availability: "Available",
      image: ship.image || ship.photoUrl || "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80",
      images: ship.images || [ship.image || "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&auto=format&fit=crop&q=80"],
      shipSpecs: {
        manufacturer: ship.builder || "Sunseeker International",
        vesselType: ship.type || "Tri-Deck Superyacht",
        length: ship.length ? `${ship.length} ft` : "88 ft 7 in",
        beam: ship.beam ? `${ship.beam} ft` : "23 ft 6 in",
        capacity: ship.capacity || "10 Guests / 4 Crew",
        engineType: ship.engines || "Twin MAN V12-2000",
        cruisingSpeed: ship.speed || "27 knots",
      },
      hp: ship.hp || "4,000 HP Total",
      topSpeed: ship.speed || "27 knots",
      description: ship.description || "Enclosed flybridge tri-deck luxury yacht.",
    }));

    return {
      success: true,
      configured: true,
      message: "Fetched boat inventory from Boats.com API",
      provider: "boats",
      category: "ship",
      items,
    };
  } catch (err) {
    return {
      success: false,
      configured: true,
      message: `Boats.com API error: ${err.message}`,
      provider: "boats",
      category: "ship",
      items: getBoatFallbackCandidates(),
    };
  }
};

const getBoatFallbackCandidates = () => [
  {
    externalId: "boats-sunseeker-ocean182-2025",
    source: "boats",
    sourceUrl: "https://boats.com/inventory/sunseeker-ocean-182",
    title: "2025 Sunseeker Ocean 182 Superyacht",
    slug: "sunseeker-ocean-182-2025",
    brand: "Sunseeker",
    model: "Ocean 182",
    year: 2025,
    price: 14200000,
    currency: "USD",
    category: "ship",
    subcategory: "Tri-Deck Superyacht",
    description: "The Sunseeker Ocean 182 offers unprecedented interior volume with an enclosed upper deck, panoramic windows, and twin MAN 2000 HP engines.",
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
  },
  {
    externalId: "boats-azimut-grande-26m-2025",
    source: "boats",
    sourceUrl: "https://boats.com/inventory/azimut-grande-26m",
    title: "2025 Azimut Grande 26M Yacht",
    slug: "azimut-grande-26m-2025",
    brand: "Azimut Yachts",
    model: "Grande 26M",
    year: 2025,
    price: 8900000,
    currency: "USD",
    category: "ship",
    subcategory: "Flybridge Yacht",
    description: "Azimut Grande 26M featuring Deck2Deck transom extension and POD propulsion system for maximum efficiency.",
    shortDescription: "Italian luxury flybridge yacht with Deck2Deck balcony.",
    location: { country: "Italy", city: "Viareggio", address: "Via Coppino" },
    condition: "New",
    availability: "Available",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80"
    ],
    features: ["Deck2Deck Transom Balcony", "ZDF Pod Propulsion", "Full Height Windows"],
    shipSpecs: {
      manufacturer: "Azimut Benetti Group",
      vesselType: "Flybridge Yacht",
      length: "85 ft 7 in",
      beam: "20 ft 8 in",
      capacity: "10 Guests / 3 Crew",
      engineType: "Twin MAN V12-1650",
      cruisingSpeed: "28 knots"
    },
    mileage: "0 hrs",
    fuel: "Marine Diesel",
    hp: "3,300 HP Total",
    topSpeed: "32 knots",
    status: "Available",
    isFeatured: true
  }
];
