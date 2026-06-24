import Inquiry from "../models/Inquiry.js";
import Vehicle from "../models/Vehicle.js";

// @desc    Get inquiries
// @route   GET /api/inquiries
// @access  Private
const getInquiries = async (req, res) => {
  try {
    let inquiries;
    if (req.user.role === "admin") {
      inquiries = await Inquiry.find({}).populate("vehicle").sort({ createdAt: -1 });
    } else {
      const userVehicles = await Vehicle.find({
        $or: [{ user: req.user._id }, { sellerId: req.user._id }]
      }).select("_id");
      const userVehicleIds = userVehicles.map(v => v._id);

      inquiries = await Inquiry.find({
        $or: [
          { user: req.user._id },
          { vehicle: { $in: userVehicleIds } }
        ]
      }).populate("vehicle").sort({ createdAt: -1 });
    }
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an inquiry
// @route   POST /api/inquiries
// @access  Public (Optional Auth)
const createInquiry = async (req, res) => {
  try {
    const { vehicleId, name, email, phone, message } = req.body;

    const inquiryData = {
      vehicle: vehicleId,
      name,
      email,
      phone: phone || "",
      message,
    };

    // If request contains authorization header (user is logged in)
    if (req.user) {
      inquiryData.user = req.user._id;
    }

    const inquiry = await Inquiry.create(inquiryData);
    const populated = await Inquiry.findById(inquiry._id).populate("vehicle");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getInquiries, createInquiry };
