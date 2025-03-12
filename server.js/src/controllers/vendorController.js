const Vendor = require("../models/Vendor");
const User = require("../models/User");

exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("userId", "name email");
        res.status(200).json(vendors);
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.getVendorById = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const vendor = await Vendor.findById(vendorId).populate("userId", "name email");

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found "});
        }
        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.updateVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const updatedVendor = await Vendor.findByIdAndUpdate().populate("vendorId", "name email");

        if (!updatedVendor) {
            return res.status(400).json({ error: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor updated successfully", updatedVendor });
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.deleteVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const deletedVendor = await Vendor.findByIdAndDelete(vendorId);

        if (!deletedVendor) {
            return res.status(400).json({ error: "Vendor not found" });
        }
        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

