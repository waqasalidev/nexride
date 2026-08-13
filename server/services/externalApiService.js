import Vehicle from "../models/Vehicle.js";
import Car from "../models/Car.js";
import Bike from "../models/Bike.js";
import Jet from "../models/Jet.js";
import Ship from "../models/Ship.js";
import { fetchCarDatabaseInventory, fetchCarImagesInventory } from "./carApiService.js";
import { fetchMotorcycleInventory } from "./motorcycleApiService.js";
import { fetchJetInventory } from "./jetApiService.js";
import { fetchBoatInventory } from "./boatApiService.js";

// Master Providers Catalog Configuration
export const PROVIDERS_CONFIG = {
  carDatabase: {
    id: "carDatabase",
    name: "CarDatabase API",
    category: "car",
    envKey: "CAR_DATABASE_API_KEY",
    description: "Global automotive specs & dealer inventory feed",
    fetchFn: (key) => fetchCarDatabaseInventory(key),
  },
  carImages: {
    id: "carImages",
    name: "CarImages API",
    category: "car",
    envKey: "CAR_IMAGES_API_KEY",
    description: "High-resolution vehicle gallery & imagery provider",
    fetchFn: (key) => fetchCarImagesInventory(key),
  },
  vehdb: {
    id: "vehdb",
    name: "VehDB Motorcycle API",
    category: "bike",
    envKey: "VEHDB_API_KEY",
    description: "Superbike & custom motorcycle dataset",
    fetchFn: (key) => fetchMotorcycleInventory(key),
  },
  jetApi: {
    id: "jetApi",
    name: "JetAPI Aviation Feed",
    category: "jet",
    envKey: "JET_API_KEY",
    description: "Executive jet & long-range aviation market data",
    fetchFn: (key) => fetchJetInventory(key),
  },
  boats: {
    id: "boats",
    name: "Boats.com Inventory API",
    category: "ship",
    envKey: "BOATS_API_KEY",
    description: "Luxury yacht & marine vessel inventory system",
    fetchFn: (key) => fetchBoatInventory(key),
  },
};

// 1. Get status overview of all configured external providers
export const getProviderStatuses = async () => {
  const statuses = [];

  for (const key of Object.keys(PROVIDERS_CONFIG)) {
    const config = PROVIDERS_CONFIG[key];
    const apiKey = process.env[config.envKey];
    const isConfigured = !!apiKey && apiKey.trim().length > 0;

    statuses.push({
      id: config.id,
      name: config.name,
      category: config.category,
      envKey: config.envKey,
      description: config.description,
      isConfigured,
      status: isConfigured ? "Configured" : "Not configured",
    });
  }

  return statuses;
};

// 2. Test specific provider connection
export const testProviderConnection = async (providerId) => {
  const config = PROVIDERS_CONFIG[providerId];
  if (!config) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  const apiKey = process.env[config.envKey];
  const isConfigured = !!apiKey && apiKey.trim().length > 0;

  try {
    const result = await config.fetchFn(apiKey);
    return {
      provider: providerId,
      name: config.name,
      isConfigured,
      status: isConfigured ? (result.success ? "Working" : "Failed") : "Not configured",
      message: result.message,
      itemCount: result.items ? result.items.length : 0,
      testedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      provider: providerId,
      name: config.name,
      isConfigured,
      status: "Failed",
      message: err.message,
      itemCount: 0,
      testedAt: new Date().toISOString(),
    };
  }
};

// 3. Fetch candidates for preview (marks already imported candidates)
export const fetchProviderCandidates = async (providerOrCategory = "all") => {
  let candidates = [];

  // Check if providerOrCategory matches a specific provider key
  if (PROVIDERS_CONFIG[providerOrCategory]) {
    const config = PROVIDERS_CONFIG[providerOrCategory];
    const apiKey = process.env[config.envKey];
    const res = await config.fetchFn(apiKey);
    candidates = res.items || [];
  } else {
    // Category match or "all"
    for (const key of Object.keys(PROVIDERS_CONFIG)) {
      const config = PROVIDERS_CONFIG[key];
      if (providerOrCategory === "all" || config.category === providerOrCategory) {
        const apiKey = process.env[config.envKey];
        const res = await config.fetchFn(apiKey);
        candidates.push(...(res.items || []));
      }
    }
  }

  // Cross-reference MongoDB for compound uniqueness (source + externalId)
  const compoundQueries = candidates
    .filter((c) => c.source && c.externalId)
    .map((c) => ({ source: c.source, externalId: c.externalId }));

  let existingDocs = [];
  if (compoundQueries.length > 0) {
    existingDocs = await Vehicle.find({ $or: compoundQueries }).select("source externalId");
  }

  const existingSet = new Set(existingDocs.map((doc) => `${doc.source}:${doc.externalId}`));

  return candidates.map((candidate) => ({
    ...candidate,
    isImported: existingSet.has(`${candidate.source}:${candidate.externalId}`),
  }));
};

// 4. Normalize item to standard NexRide Vehicle Schema
export const normalizeProduct = (item, defaultSource = "manual") => {
  const brand = item.brand || "Exclusive";
  const model = item.model || "Product";
  const year = Number(item.year) || new Date().getFullYear();
  const title = item.title || `${year} ${brand} ${model}`;
  const slug = item.slug || `${brand}-${model}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Math.random().toString(36).substring(2, 6)}`;
  const source = item.source || defaultSource;
  const externalId = item.externalId || `ext-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Normalize image with fallbacks
  let primaryImage = item.image || item.thumbnail;
  let gallery = Array.isArray(item.images) ? item.images.filter(Boolean) : [];

  if (!primaryImage && gallery.length > 0) {
    primaryImage = gallery[0];
  }

  if (!primaryImage) {
    primaryImage = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80";
  }

  if (gallery.length === 0) {
    gallery = [primaryImage];
  }

  return {
    title,
    slug,
    brand,
    model,
    year,
    price: Number(item.price) || 100000,
    originalPrice: Number(item.price) || 100000,
    discountedPrice: Number(item.price) || 100000,
    currency: item.currency || "USD",
    category: item.category || "car",
    subcategory: item.subcategory || "",
    description: item.description || "",
    shortDescription: item.shortDescription || (item.description ? item.description.substring(0, 140) : ""),
    location: item.location || { country: "United States", city: "Miami", address: "" },
    condition: item.condition || "New",
    availability: item.availability || "Available",
    image: primaryImage,
    images: gallery,
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
    externalId,
    source,
    sourceUrl: item.sourceUrl || "",
  };
};

// Helper for sub-collection persistence
const saveSubCollectionDoc = async (doc) => {
  const subDoc = { _id: doc._id, ...doc.toObject() };
  if (doc.category === "car") await Car.create(subDoc);
  else if (doc.category === "bike") await Bike.create(subDoc);
  else if (doc.category === "jet") await Jet.create(subDoc);
  else if (doc.category === "ship") await Ship.create(subDoc);
};

// Helper for sub-collection update
const updateSubCollectionDoc = async (doc) => {
  const id = doc._id;
  await Car.findByIdAndDelete(id);
  await Bike.findByIdAndDelete(id);
  await Jet.findByIdAndDelete(id);
  await Ship.findByIdAndDelete(id);

  const subDoc = { _id: id, ...doc.toObject() };
  if (doc.category === "car") await Car.create(subDoc);
  else if (doc.category === "bike") await Bike.create(subDoc);
  else if (doc.category === "jet") await Jet.create(subDoc);
  else if (doc.category === "ship") await Ship.create(subDoc);
};

// 5. Import selected items with duplicate detection & source tracking
export const importSelectedProducts = async (rawItems, userId) => {
  let imported = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const results = [];

  for (const rawItem of rawItems) {
    try {
      if (!rawItem.title && (!rawItem.brand || !rawItem.model)) {
        skipped++;
        results.push({ item: rawItem.title || "Unknown", status: "Skipped", reason: "Missing title or brand/model" });
        continue;
      }

      const normalized = normalizeProduct(rawItem);
      normalized.user = userId;
      normalized.sellerId = userId;

      // Duplicate check by source + externalId
      const existing = await Vehicle.findOne({ source: normalized.source, externalId: normalized.externalId });

      if (existing) {
        // Update existing record
        Object.assign(existing, normalized);
        const saved = await existing.save();
        await updateSubCollectionDoc(saved);
        updated++;
        results.push({ item: normalized.title, status: "Updated", id: saved._id });
      } else {
        // Create new record
        const created = await Vehicle.create(normalized);
        await saveSubCollectionDoc(created);
        imported++;
        results.push({ item: normalized.title, status: "Imported", id: created._id });
      }
    } catch (err) {
      failed++;
      results.push({ item: rawItem.title || "Unknown", status: "Failed", reason: err.message });
    }
  }

  return {
    fetched: rawItems.length,
    imported,
    updated,
    skipped,
    failed,
    results,
  };
};

// 6. Bulk sync provider inventory into MongoDB
export const syncProviderInventory = async (targetProviderOrAll = "all", userId) => {
  const candidates = await fetchProviderCandidates(targetProviderOrAll);
  return await importSelectedProducts(candidates, userId);
};
