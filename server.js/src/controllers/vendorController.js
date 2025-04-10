/*const Vendor = require("../models/Vendor");
const User = require("../models/User");
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");
const bcrypt = require("bcryptjs");

exports.getPendingVendors = async (req, res) => {
    try {
      console.log("Fetching pending vendors...");
      const pendingVendors = await Vendor.find({ isApproved: false });
      console.log("Found vendors:", pendingVendors);
      res.status(200).json(pendingVendors);
    } catch (err) {
      console.error("Error in getPendingVendors:", err);
      res.status(500).json({ msg: "Server error" });
    }
  };
  
  
  /*exports.getApproveVendor = async (req, res) => {
    const { vendorId } = req.params;
    const { registrationStatus } = req.body; // "approved" or "rejected"
  
    try {
      const updatedVendor = await Vendor.findByIdAndUpdate(
        vendorId,
        { isApproved: registrationStatus === "approved", registrationStatus },
        { new: true }
      );
  
      if (!updatedVendor) {
        return res.status(404).json({ msg: "Vendor not found" });
      }
  
      res.status(200).json({ msg: `Vendor ${registrationStatus}`, vendor: updatedVendor });
    } catch (error) {
      res.status(500).json({ msg: "Error updating vendor approval", error: error.message });
    }
  };
  
 // In vendorController.js
exports.approveVendor = async (req, res) => {
    try {
      const { vendorId } = req.params;
      const { approvalStatus } = req.body;
  
      const vendor = await User.findById(vendorId);
      if (!vendor) {
        return res.status(404).json({ msg: "Vendor not found" });
      }
  
      vendor.approvalStatus = approvalStatus;
      await vendor.save();
  
      res.status(200).json({ msg: `Vendor ${approvalStatus}` });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  
  
  exports.getApprovedVendors = async (req, res) => {
    try {
      const approvedVendors = await User.find({ role: 'vendor', approvalStatus: 'approved' });
      res.status(200).json(approvedVendors);
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  };
  

exports.getAllVendors = async (req, res) => {
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


exports.getVendorProfile = async (req, res) => {
    try {

        const vendor = await User.findById(req.user._id);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json(vendor);
    } catch (error) {
        console.error("Error in getVendorById:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



exports.updateVendorProfile = async (req, res) => {
    try {
        const vendor = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        res.status(200).json({ message: "Vendor updated successfully", vendor });
    } catch (error) {
        console.error("Error in updateVendor:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.changeVendorPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!req.user || req.user.role !== "vendor") {
            return res.status(403).json({ error: "Access denied! Vendors only" });
        }

        const vendorId = req.user._id;
        console.log("Vendor ID from Token:", vendorId);

        const vendor = await User.findById(vendorId);
        console.log("Vendor Data from DB:", vendor);

        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (!vendor.password) {
            return res.status(500).json({ error: "Vendor password not set" });
        }

        const isMatch = await bcrypt.compare(oldPassword, vendor.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "New passwords do not match" });
        }

        vendor.password = await bcrypt.hash(newPassword, 10);
        await vendor.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error in changeVendorPassword:", error);
        res.status(500).json({ error: "Failed to change password", details: error.message });
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

exports.manageStoreInfo = async (req, res) => {
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.user._id, req.body, { new: true });

        if (!vendor) return res.status(404).json({ error: "Vendor not found" });

        res.status(200).json({ message: "Store information updated successfully", vendor });
    } catch (error) {
        res.status(500).json({ error: "Failed to update store info", details: error.message });
    }
};

exports.getVendorPerformanceReport = async (req, res) => {
    try {
        const vendorsPerformance = await Vendor.aggregate([
            {
                $lookup: {
                    from: "orders", 
                    localField: "_id",
                    foreignField: "vendorId",
                    as: "orders"
                }
            },
            {
                $unwind: "$orders" 
            },
            {
                $group: {
                    _id: "$_id", 
                    storeName: { $first: "$storeName" },
                    totalSales: { $sum: "$orders.totalAmount" }, 
                    totalOrders: { $sum: 1 }, 
                }
            },
            {
                $sort: { totalSales: -1 } 
            }
        ]);

       
        if (!vendorsPerformance.length) {
            return res.status(404).json({ msg: "No vendors found or no sales data" });
        }

       
        res.status(200).json(vendorsPerformance);
    } catch (error) {
        console.error("Error fetching vendor performance:", error);
        res.status(500).json({ msg: "Failed to fetch vendor productivity report", error: error.message });
    }
};
*/