import Vehicle from "../models/Vehicle.js";
import Car from "../models/Car.js";
import Bike from "../models/Bike.js";
import Jet from "../models/Jet.js";
import Ship from "../models/Ship.js";
import { saveBase64Image, deleteLocalImage } from "../utils/imageHandler.js";

// Helper to save in specific collection
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

// Helper to update in specific collection
const updateInSubCollection = async (id, vehicleData) => {
  const { category } = vehicleData;
  // Clear from other sub-collections in case category changed
  await Car.findByIdAndDelete(id);
  await Bike.findByIdAndDelete(id);
  await Jet.findByIdAndDelete(id);
  await Ship.findByIdAndDelete(id);

  if (category === "car") {
    await Car.create({ _id: id, ...vehicleData });
  } else if (category === "bike") {
    await Bike.create({ _id: id, ...vehicleData });
  } else if (category === "jet") {
    await Jet.create({ _id: id, ...vehicleData });
  } else if (category === "ship") {
    await Ship.create({ _id: id, ...vehicleData });
  }
};

// Helper to delete from specific collection
const deleteFromSubCollection = async (id) => {
  await Car.findByIdAndDelete(id);
  await Bike.findByIdAndDelete(id);
  await Jet.findByIdAndDelete(id);
  await Ship.findByIdAndDelete(id);
};

// Helper to construct filter query based on user status
const getStatusFilter = (req) => {
  let filter = {};
  if (!req.user || req.user.role !== "admin") {
    if (req.user) {
      filter = {
        $or: [
          { status: { $in: ["Approved", "Featured", "Sold", "Available", "Discounted", "Coming Soon"] } },
          { sellerId: req.user._id },
          { user: req.user._id }
        ]
      };
    } else {
      filter = { status: { $in: ["Approved", "Featured", "Sold", "Available", "Discounted", "Coming Soon"] } };
    }
  }
  return filter;
};

// @desc    Fetch all vehicles
// @route   GET /api/vehicles
// @access  Public
const getVehicles = async (req, res) => {
  try {
    const filter = getStatusFilter(req);
    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all cars
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const filter = getStatusFilter(req);
    const cars = await Car.find(filter).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all bikes
// @route   GET /api/bikes
// @access  Public
const getBikes = async (req, res) => {
  try {
    const filter = getStatusFilter(req);
    const bikes = await Bike.find(filter).sort({ createdAt: -1 });
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all jets
// @route   GET /api/jets
// @access  Public
const getJets = async (req, res) => {
  try {
    const filter = getStatusFilter(req);
    const jets = await Jet.find(filter).sort({ createdAt: -1 });
    res.json(jets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch all ships
// @route   GET /api/ships
// @access  Public
const getShips = async (req, res) => {
  try {
    const filter = getStatusFilter(req);
    const ships = await Ship.find(filter).sort({ createdAt: -1 });
    res.json(ships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Public
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuel,
      category,
      subcategory,
      description,
      image,
      images,
      features,
      specifications,
      stock,
      tag,
      hp,
      topSpeed,
      status,
      discountPercentage,
    } = req.body;

    // Validation
    if (!brand || !model || !year || !price || !category) {
      return res.status(400).json({ message: "Please fill in all required fields (brand, model, year, price, category)" });
    }

    // Process images
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

    // Admin-created listings default to Available; user submissions stay Pending
    const listingStatus = req.user?.role === "admin"
      ? (status || "Available")
      : "Pending";

    // Compute prices and featured status
    const discount = Number(discountPercentage) || 0;
    const origPrice = Number(price);
    const discPrice = discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;
    const isFeat = listingStatus === "Featured" || req.body.isFeatured === true;

    const vehicleData = {
      brand,
      model,
      year: Number(year),
      price: discPrice, // Queryable active price
      originalPrice: origPrice,
      discountedPrice: discPrice,
      discountPercentage: discount,
      isFeatured: isFeat,
      mileage: mileage || "0 mi",
      fuel: fuel || "Gasoline",
      category,
      subcategory: subcategory || "",
      description: description || "",
      image: savedPrimaryImage,
      images: savedAdditionalImages,
      features: features || [],
      specifications: specifications || {},
      stock: stock !== undefined ? Number(stock) : 1,
      tag: tag || "",
      hp: hp || "",
      topSpeed: topSpeed || "",
      user: req.user ? req.user._id : undefined,
      sellerId: req.user ? req.user._id : undefined,
      status: listingStatus,
    };

    const vehicle = await Vehicle.create(vehicleData);
    
    // Save in sub-collection (cars, bikes, jets, or ships)
    await saveToSubCollection({ _id: vehicle._id, ...vehicleData });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      // Access check: Only Admin or the listing creator can update
      if (
        req.user.role !== "admin" &&
        vehicle.user &&
        vehicle.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized to edit this vehicle" });
      }

      // Handle image updates and file cleanup
      const oldImages = vehicle.images || [];
      const oldPrimaryImage = vehicle.image;
      const newImages = req.body.images !== undefined ? req.body.images : (req.body.image ? [req.body.image] : []);
      const newPrimaryImage = req.body.image;

      // Identify files removed
      const oldFiles = [...new Set([oldPrimaryImage, ...oldImages])];
      const newFiles = [...new Set([newPrimaryImage, ...newImages])];
      const removedFiles = oldFiles.filter(oldF => oldF && !newFiles.includes(oldF));

      for (const removedF of removedFiles) {
        await deleteLocalImage(removedF);
      }

      // Convert new base64 uploads to files
      let savedPrimaryImage = vehicle.image;
      if (req.body.image !== undefined) {
        savedPrimaryImage = await saveBase64Image(req.body.image);
      }

      let savedAdditionalImages = vehicle.images;
      if (req.body.images !== undefined) {
        savedAdditionalImages = [];
        if (Array.isArray(req.body.images)) {
          for (const img of req.body.images) {
            savedAdditionalImages.push(await saveBase64Image(img));
          }
        }
      }

      // Compute pricing and featured status
      const discount = req.body.discountPercentage !== undefined 
        ? Number(req.body.discountPercentage) 
        : (vehicle.discountPercentage || 0);

      const inputPrice = req.body.price !== undefined 
        ? Number(req.body.price) 
        : (req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : (vehicle.originalPrice || vehicle.price));

      const origPrice = inputPrice;
      const discPrice = discount > 0 ? Math.round(origPrice * (1 - discount / 100)) : origPrice;

      const newStatus = req.body.status || vehicle.status;
      const isFeat = newStatus === "Featured" || req.body.isFeatured === true || (req.body.isFeatured === undefined && vehicle.isFeatured);

      vehicle.brand = req.body.brand || vehicle.brand;
      vehicle.model = req.body.model || vehicle.model;
      vehicle.year = req.body.year !== undefined ? Number(req.body.year) : vehicle.year;
      vehicle.price = discPrice;
      vehicle.originalPrice = origPrice;
      vehicle.discountedPrice = discPrice;
      vehicle.discountPercentage = discount;
      vehicle.isFeatured = isFeat;
      vehicle.mileage = req.body.mileage !== undefined ? req.body.mileage : vehicle.mileage;
      vehicle.fuel = req.body.fuel || vehicle.fuel;
      vehicle.category = req.body.category || vehicle.category;
      vehicle.subcategory = req.body.subcategory !== undefined ? req.body.subcategory : vehicle.subcategory;
      vehicle.description = req.body.description !== undefined ? req.body.description : vehicle.description;
      vehicle.image = savedPrimaryImage;
      vehicle.images = savedAdditionalImages;
      vehicle.features = req.body.features !== undefined ? req.body.features : vehicle.features;
      vehicle.specifications = req.body.specifications !== undefined ? req.body.specifications : vehicle.specifications;
      vehicle.stock = req.body.stock !== undefined ? Number(req.body.stock) : vehicle.stock;
      vehicle.tag = req.body.tag !== undefined ? req.body.tag : vehicle.tag;
      vehicle.hp = req.body.hp !== undefined ? req.body.hp : vehicle.hp;
      vehicle.topSpeed = req.body.topSpeed !== undefined ? req.body.topSpeed : vehicle.topSpeed;

      if (req.body.status !== undefined) {
        if (req.user.role === "admin" || req.body.status === "Sold") {
          vehicle.status = req.body.status;
        }
      }

      const updatedVehicle = await vehicle.save();

      // Update in sub-collection as well
      await updateInSubCollection(req.params.id, {
        brand: updatedVehicle.brand,
        model: updatedVehicle.model,
        year: updatedVehicle.year,
        price: updatedVehicle.price,
        originalPrice: updatedVehicle.originalPrice,
        discountedPrice: updatedVehicle.discountedPrice,
        discountPercentage: updatedVehicle.discountPercentage,
        isFeatured: updatedVehicle.isFeatured,
        mileage: updatedVehicle.mileage,
        fuel: updatedVehicle.fuel,
        category: updatedVehicle.category,
        subcategory: updatedVehicle.subcategory,
        description: updatedVehicle.description,
        image: updatedVehicle.image,
        images: updatedVehicle.images,
        features: updatedVehicle.features,
        specifications: updatedVehicle.specifications,
        stock: updatedVehicle.stock,
        tag: updatedVehicle.tag,
        hp: updatedVehicle.hp,
        topSpeed: updatedVehicle.topSpeed,
        user: updatedVehicle.user,
        sellerId: updatedVehicle.sellerId,
        status: updatedVehicle.status,
        approvedBy: updatedVehicle.approvedBy,
        approvalDate: updatedVehicle.approvalDate,
        rejectionReason: updatedVehicle.rejectionReason,
      });

      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update vehicle status (Approve / Reject)
// @route   PUT /api/vehicles/:id/status
// @access  Private/Admin
const updateVehicleStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.status = status;
    if (status === "Approved") {
      vehicle.approvedBy = req.user._id;
      vehicle.approvalDate = new Date();
      vehicle.rejectionReason = "";
    } else if (status === "Rejected") {
      vehicle.rejectionReason = rejectionReason || "No reason provided";
    }

    const updatedVehicle = await vehicle.save();

    const subUpdate = {
      status: updatedVehicle.status,
      approvedBy: updatedVehicle.approvedBy,
      approvalDate: updatedVehicle.approvalDate,
      rejectionReason: updatedVehicle.rejectionReason,
    };

    if (updatedVehicle.category === "car") {
      await Car.findByIdAndUpdate(req.params.id, subUpdate);
    } else if (updatedVehicle.category === "bike") {
      await Bike.findByIdAndUpdate(req.params.id, subUpdate);
    } else if (updatedVehicle.category === "jet") {
      await Jet.findByIdAndUpdate(req.params.id, subUpdate);
    } else if (updatedVehicle.category === "ship") {
      await Ship.findByIdAndUpdate(req.params.id, subUpdate);
    }

    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      // Access check: Only Admin or the listing creator can delete
      if (
        req.user.role !== "admin" &&
        vehicle.user &&
        vehicle.user.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({ message: "Not authorized to delete this vehicle" });
      }

      // Delete associated local images from disk
      const imagesToDelete = [];
      if (vehicle.image) imagesToDelete.push(vehicle.image);
      if (vehicle.images && Array.isArray(vehicle.images)) {
        imagesToDelete.push(...vehicle.images);
      }

      const uniqueImages = [...new Set(imagesToDelete)];
      for (const img of uniqueImages) {
        await deleteLocalImage(img);
      }

      await Vehicle.findByIdAndDelete(req.params.id);
      
      // Delete from specific category collection
      await deleteFromSubCollection(req.params.id);

      res.json({ message: "Vehicle removed successfully" });
    } else {
      res.status(404).json({ message: "Vehicle not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getVehicles,
  getCars,
  getBikes,
  getJets,
  getShips,
  getVehicleById,
  createVehicle,
  updateVehicle,
  updateVehicleStatus,
  deleteVehicle,
};
