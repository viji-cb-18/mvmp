const Vendor = require("../models/Vendor");
const User = require("../models/User");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");

exports.getVendors = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied! Admins only" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : -1;

        const search = req.query.search || "";
        const filter = { role: "vendor" };
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const vendors = await User.find(filter)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        if (!vendors || vendors.length === 0) {
                return res.status(404).json({ msg: "No vendors found" });
        }
    
        res.status(200).json({
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                data: vendors
        });
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.getVendorById = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await User.findById(vendorId);

        if (!vendor || vendor.role !== "vendor") {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== vendor._id.toString()) {
            return res.status(403).json({ error: "Access denied! You can only view your own vendor profile" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error in getVendorById:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



exports.updateVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;

        const vendor = await User.findById(vendorId);

        if (!vendor || vendor.role !== "vendor") {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== vendor._id.toString()) {
            return res.status(403).json({ error: "Access denied! You can only update your own vendor profile" });
        }

        const updatedVendor = await User.findByIdAndUpdate(vendorId, req.body, { new: true });

        res.status(200).json({ message: "Vendor updated successfully", updatedVendor });
    } catch (error) {
        console.error("Error in updateVendor:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.deleteVendor = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied! Admins only" });
        }

        const { vendorId } = req.params;

        const deletedVendor = await User.findByIdAndDelete(vendorId);

        if (!deletedVendor || deletedVendor.role !== "vendor") {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor deleted successfully" });
    } catch (error) {
        console.error("Error in deleteVendor:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.uploadStoreLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const imageUrl = await uploadToCloudinary(req.file.path);

        const vendor = await Vendor.findByIdAndUpdate(req.user_id, { storeLogo: imageUrl}, { new: true });

        res.staus(200).json({ msg: "Store logo uploaded successfully", vendor });
    } catch (error) {
        res.status(500).json({ error: "Image uploaded failed", details: error.message });
    }
}