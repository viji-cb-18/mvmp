const Vendor = require("../models/Vendor");
const User = require("../models/User");

exports.addVendor = async (req, res) => {
    try {
        const { userId, storeName, description, contactNumber } = req.body;

        if (!userId || !storeName || !contactNumber) {
            return res.status(400).json({ error: "User ID, Store Name, and Contact Number are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role !== "vendor" && user.role !== "admin") {
            return res.status(403).json({ error: "Only vendors or admins can create a vendor account" });
        }

        const newVendor = new Vendor({ userId, storeName, description, contactNumber });
        await newVendor.save();
        res.status(201).json({ msg: "Vendor added successfully", vendor: newVendor });

    } catch (error) {
        console.error("Error in addVendor:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate("userId", "name email");
        res.status(200).json(vendors);
    } catch (error) {
        console.error("Error in getVendors:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
