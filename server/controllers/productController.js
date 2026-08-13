import Vehicle from "../models/Vehicle.js";
import Car from "../models/Car.js";
import Bike from "../models/Bike.js";
import Jet from "../models/Jet.js";
import Ship from "../models/Ship.js";
import {
  getProviderStatuses,
  testProviderConnection,
  fetchProviderCandidates,
  importSelectedProducts,
  syncProviderInventory,
  normalizeProduct,
} from "../services/externalApiService.js";

// Helper to save document in matching sub-collection (cars, bikes, jets, ships)
const saveToSubCollection = async (vehicleData) => {
  const { category } = vehicleData;
  if (category === "car") {
    await Car.create(vehicleData);
  } else if (category === "bike") {
    await Bike.create(vehicleData);
  } else if (category === "jet") {
    await Jet.create(vehicleData);
  } else if (category === "ship") {
    await Ship.create(vehicleData);
  }
};

// Helper to update document in matching sub-collection
const updateInSubCollection = async (id, vehicleData) => {
  const { category } = vehicleData;
  await Car.findByIdAndDelete(id);
  await Bike.findByIdAndDelete(id);
  await Jet.findByIdAndDelete(id);
  await Ship.findByIdAndDelete(id);

  const doc = { _id: id, ...vehicleData };
  if (category === "car") {
    await Car.create(doc);
  } else if (category === "bike") {
    await Bike.create(doc);
  } else if (category === "jet") {
    await Jet.create(doc);
  } else if (category === "ship") {
    await Ship.create(doc);
  }
};

// Helper to delete document from sub-collections
const deleteFromSubCollection = async (id) => {
  await Car.findByIdAndDelete(id);
  await Bike.findByIdAndDelete(id);
  await Jet.findByIdAndDelete(id);
  await Ship.findByIdAndDelete(id);
};

// Helper to generate slug
const generateSlug = (brand, model, year) => {
  const base = `${brand}-${model}-${year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `${base}-${Date.now().toString(36)}`;
};

// @desc    Get paginated, filtered, sorted products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const {
      category,
      brand,
      minPrice,
      maxPrice,
      condition,
      availability,
      status,
      search,
      location,
      sort,
      featured,
    } = req.query;

    const query = {};

    // Access visibility logic
    if (!req.user || req.user.role !== "admin") {
      if (req.user) {
        query.$or = [
          { status: { $in: ["Approved", "Featured", "Sold", "Available", "Discounted", "Coming Soon"] } },
          { sellerId: req.user._id },
          { user: req.user._id },
        ];
      } else {
        query.status = { $in: ["Approved", "Featured", "Sold", "Available", "Discounted", "Coming Soon"] };
      }
    }

    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    if (brand && brand !== "all") {
      query.brand = { $regex: new RegExp(`^${brand}$`, "i") };
    }

    if (condition && condition !== "all") {
      query.condition = condition;
    }

    if (availability && availability !== "all") {
      query.availability = availability;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (featured === "true" || featured === "1") {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (location) {
      query.$or = query.$or || [];
      const locRegex = new RegExp(location, "i");
      query.$or.push(
        { "location.country": locRegex },
        { "location.city": locRegex },
        { "location.address": locRegex }
      );
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchConditions = [
        { title: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { description: searchRegex },
        { "location.country": searchRegex },
        { "location.city": searchRegex },
      ];

      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === "oldest") {
      sortOptions = { createdAt: 1 };
    } else if (sort === "price_asc" || sort === "price_low") {
      sortOptions = { price: 1 };
    } else if (sort === "price_desc" || sort === "price_high") {
      sortOptions = { price: -1 };
    } else if (sort === "featured") {
      sortOptions = { isFeatured: -1, createdAt: -1 };
    } else if (sort === "a_z") {
      sortOptions = { brand: 1, model: 1 };
    }

    const totalProducts = await Vehicle.countDocuments(query);
    const products = await Vehicle.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit) || 1;

    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      page,
      pages: totalPages,
      limit,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const param = req.params.id;
    let product;
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Vehicle.findById(param);
    } else {
      product = await Vehicle.findOne({ slug: param });
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Vehicle.find({ isFeatured: true, status: { $in: ["Available", "Featured", "Approved"] } })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = { category };
    const totalProducts = await Vehicle.countDocuments(query);
    const products = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const regex = new RegExp(q, "i");
    const products = await Vehicle.find({
      $or: [
        { title: regex },
        { brand: regex },
        { model: regex },
        { category: regex },
        { subcategory: regex },
        { "location.country": regex },
        { "location.city": regex },
      ],
    }).limit(20);

    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      brand,
      model,
      year,
      price,
      currency,
      mileage,
      fuel,
      category,
      subcategory,
      description,
      shortDescription,
      location,
      condition,
      availability,
      image,
      images,
      features,
      specifications,
      carSpecs,
      bikeSpecs,
      jetSpecs,
      shipSpecs,
      stock,
      tag,
      hp,
      topSpeed,
      status,
      discountPercentage,
      isFeatured,
    } = req.body;

    if (!brand || !model || !year || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (brand, model, year, price, category)",
      });
    }

    let primaryImage = image;
    let additionalImages = images || [];
    if (!primaryImage && additionalImages.length > 0) {
      primaryImage = additionalImages[0];
    }

    const savedPrimaryImage = await saveBase64Image(primaryImage);
    const savedAdditionalImages = [];
    if (additionalImages && Array.isArray(additionalImages)) {
      for (const img of additionalImages) {
        savedAdditionalImages.push(await saveBase64Image(img));
      }
    }

    const listingStatus = req.user?.role === "admin"
      ? (status || "Available")
      : "Pending";

    const discount = Number(discountPercentage) || 0;
    const origPrice = Number(price);
    const discPrice = discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;
    const isFeat = listingStatus === "Featured" || isFeatured === true;

    const productTitle = title || `${year} ${brand} ${model}`;
    const productSlug = slug || generateSlug(brand, model, year);

    const productData = {
      title: productTitle,
      slug: productSlug,
      brand,
      model,
      year: Number(year),
      price: discPrice,
      originalPrice: origPrice,
      discountedPrice: discPrice,
      discountPercentage: discount,
      currency: currency || "USD",
      isFeatured: isFeat,
      mileage: mileage || carSpecs?.mileage || bikeSpecs?.mileage || "0 mi",
      fuel: fuel || carSpecs?.fuelType || bikeSpecs?.fuelType || "Gasoline",
      category,
      subcategory: subcategory || "",
      description: description || "",
      shortDescription: shortDescription || (description ? description.substring(0, 140) : ""),
      location: location || { country: "United States", city: "Miami", address: "" },
      condition: condition || "Used",
      availability: availability || "Available",
      image: savedPrimaryImage,
      images: savedAdditionalImages,
      features: features || [],
      specifications: specifications || {},
      carSpecs: carSpecs || {},
      bikeSpecs: bikeSpecs || {},
      jetSpecs: jetSpecs || {},
      shipSpecs: shipSpecs || {},
      stock: stock !== undefined ? Number(stock) : 1,
      tag: tag || "",
      hp: hp || carSpecs?.horsepower || bikeSpecs?.horsepower || "",
      topSpeed: topSpeed || bikeSpecs?.topSpeed || jetSpecs?.cruisingSpeed || shipSpecs?.cruisingSpeed || "",
      user: req.user ? req.user._id : undefined,
      sellerId: req.user ? req.user._id : undefined,
      status: listingStatus,
    };

    const product = await Vehicle.create(productData);
    await saveToSubCollection({ _id: product._id, ...productData });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
export const updateProduct = async (req, res) => {
  try {
    const product = await Vehicle.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (
      req.user.role !== "admin" &&
      product.user &&
      product.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this product" });
    }

    const oldImages = product.images || [];
    const oldPrimaryImage = product.image;
    const newImages = req.body.images !== undefined ? req.body.images : (req.body.image ? [req.body.image] : []);
    const newPrimaryImage = req.body.image;

    const oldFiles = [...new Set([oldPrimaryImage, ...oldImages])];
    const newFiles = [...new Set([newPrimaryImage, ...newImages])];
    const removedFiles = oldFiles.filter((oldF) => oldF && !newFiles.includes(oldF));

    for (const removedF of removedFiles) {
      await deleteLocalImage(removedF);
    }

    let savedPrimaryImage = product.image;
    if (req.body.image !== undefined) {
      savedPrimaryImage = await saveBase64Image(req.body.image);
    }

    let savedAdditionalImages = product.images;
    if (req.body.images !== undefined) {
      savedAdditionalImages = [];
      if (Array.isArray(req.body.images)) {
        for (const img of req.body.images) {
          savedAdditionalImages.push(await saveBase64Image(img));
        }
      }
    }

    const discount = req.body.discountPercentage !== undefined
      ? Number(req.body.discountPercentage)
      : (product.discountPercentage || 0);

    const inputPrice = req.body.price !== undefined
      ? Number(req.body.price)
      : (req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : (product.originalPrice || product.price));

    const origPrice = inputPrice;
    const discPrice = discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;

    const newStatus = req.body.status || product.status;
    const isFeat = newStatus === "Featured" || req.body.isFeatured === true || (req.body.isFeatured === undefined && product.isFeatured);

    product.title = req.body.title || product.title;
    product.slug = req.body.slug || product.slug;
    product.brand = req.body.brand || product.brand;
    product.model = req.body.model || product.model;
    product.year = req.body.year !== undefined ? Number(req.body.year) : product.year;
    product.price = discPrice;
    product.originalPrice = origPrice;
    product.discountedPrice = discPrice;
    product.discountPercentage = discount;
    product.currency = req.body.currency || product.currency;
    product.isFeatured = isFeat;
    product.mileage = req.body.mileage !== undefined ? req.body.mileage : product.mileage;
    product.fuel = req.body.fuel || product.fuel;
    product.category = req.body.category || product.category;
    product.subcategory = req.body.subcategory !== undefined ? req.body.subcategory : product.subcategory;
    product.description = req.body.description !== undefined ? req.body.description : product.description;
    product.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : product.shortDescription;
    product.location = req.body.location || product.location;
    product.condition = req.body.condition || product.condition;
    product.availability = req.body.availability || product.availability;
    product.image = savedPrimaryImage;
    product.images = savedAdditionalImages;
    product.features = req.body.features !== undefined ? req.body.features : product.features;
    product.specifications = req.body.specifications !== undefined ? req.body.specifications : product.specifications;
    product.carSpecs = req.body.carSpecs !== undefined ? req.body.carSpecs : product.carSpecs;
    product.bikeSpecs = req.body.bikeSpecs !== undefined ? req.body.bikeSpecs : product.bikeSpecs;
    product.jetSpecs = req.body.jetSpecs !== undefined ? req.body.jetSpecs : product.jetSpecs;
    product.shipSpecs = req.body.shipSpecs !== undefined ? req.body.shipSpecs : product.shipSpecs;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    product.tag = req.body.tag !== undefined ? req.body.tag : product.tag;
    product.hp = req.body.hp !== undefined ? req.body.hp : product.hp;
    product.topSpeed = req.body.topSpeed !== undefined ? req.body.topSpeed : product.topSpeed;

    if (req.body.status !== undefined && (req.user.role === "admin" || req.body.status === "Sold")) {
      product.status = req.body.status;
    }

    const updatedProduct = await product.save();
    await updateInSubCollection(req.params.id, updatedProduct.toObject());

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
export const deleteProduct = async (req, res) => {
  try {
    const product = await Vehicle.findById(req.params.id);

    if (product) {
      if (
        req.user.role !== "admin" &&
        product.user &&
        product.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this product" });
      }

      const imagesToDelete = [];
      if (product.image) imagesToDelete.push(product.image);
      if (product.images && Array.isArray(product.images)) {
        imagesToDelete.push(...product.images);
      }

      for (const img of [...new Set(imagesToDelete)]) {
        await deleteLocalImage(img);
      }

      await Vehicle.findByIdAndDelete(req.params.id);
      await deleteFromSubCollection(req.params.id);

      res.json({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// @desc    Get status of all configured external inventory providers
// @route   GET /api/products/external/providers
// @access  Private/Admin
export const getProviderStatusesController = async (req, res) => {
  try {
    const statuses = await getProviderStatuses();
    res.json(statuses);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Test connection to a specific provider
// @route   POST /api/products/external/test/:provider
// @access  Private/Admin
export const testProviderConnectionController = async (req, res) => {
  try {
    const { provider } = req.params;
    const result = await testProviderConnection(provider);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch external candidates from provider for preview
// @route   GET /api/products/external/:provider
// @access  Private/Admin
export const fetchProviderInventoryController = async (req, res) => {
  try {
    const { provider } = req.params;
    const candidates = await fetchProviderCandidates(provider);
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Import selected external products into MongoDB
// @route   POST /api/products/import
// @access  Private/Admin
export const importProductsController = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided for import" });
    }

    const summary = await importSelectedProducts(items, req.user._id);
    res.status(201).json({
      success: true,
      message: `Import complete. Imported: ${summary.imported}, Updated: ${summary.updated}, Skipped: ${summary.skipped}, Failed: ${summary.failed}`,
      ...summary,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Bulk sync provider inventory into MongoDB
// @route   POST /api/products/sync
// @access  Private/Admin
export const syncProductsController = async (req, res) => {
  try {
    const provider = req.body.provider || "all";
    const summary = await syncProviderInventory(provider, req.user._id);
    res.json({
      success: true,
      message: `Sync finished for provider '${provider}'. Imported: ${summary.imported}, Updated: ${summary.updated}, Skipped: ${summary.skipped}, Failed: ${summary.failed}`,
      ...summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

