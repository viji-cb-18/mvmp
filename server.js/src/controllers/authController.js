const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            role,
            approvalStatus: role === "vendor" ? "pending" : "approved",
        });

        await user.save();
        res.status(201).json({ msg: `${role} registered successfully`, user });
    } catch (error) {
        res.status(500).json({ msg: "Registration failed", error: error.message });
    }
};


exports.loginUser = async (req, res) => {
    console.log("Login Request Body:", req.body);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ msg: "Login successful", token, user });

    } catch (error) {
        console.error("Error in loginUser:", error.message);
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
      const { role } = req.query;
      const filter = role ? { role } : {};
  
      const users = await User.find(filter, { password: 0 }).sort({ createdAt: -1 });
      res.status(200).json({ msg: "Success", data: users });
    } catch (error) {
      res.status(500).json({ msg: "Failed to fetch users", error: error.message });
    }
  };


exports.getUserById =async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== "admin" && req.user.userId !== userId) {
            return res.status(403).json({ msg: "Access denied! You can only view your own profile" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch profile", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  console.log("Incoming update profile request:", req.body); 
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ msg: "Profile updated", user: updatedUser });
  } catch (error) {
    console.error("Profile update error →", error.message); 
    res.status(500).json({ msg: "Update failed", error: error.message });
  }
};



exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update password", details: error.message });
  }
};



exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ msg: "Failed to delete user", details: error.message });
    }
  };
  
  
  exports.getAllVendors = async (req, res) => {
    try {
      const vendors = await User.find({ role: 'vendor', approvalStatus: 'approved' }).select('-password');
      res.status(200).json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ msg: "Internal server error", error: error.message });
    }
  };
  
  
exports.getPendingVendors = async (req, res) => {
    try {
        const pendingVendors = await User.find({ role: "vendor", approvalStatus: "pending" });
        res.status(200).json(pendingVendors);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

  
  exports.approveVendor = async (req, res) => {
    const { id } = req.params;
    const { approvalStatus } = req.body; 
  
    try {
      const vendor = await User.findByIdAndUpdate(
        id,
        { approvalStatus },
        { new: true }
      );
      if (!vendor) {
        return res.status(404).json({ msg: "Vendor not found" });
      }
      res.status(200).json({ msg: `Vendor ${approvalStatus}`, vendor });
    } catch (error) {
      res.status(500).json({ msg: "Error updating vendor status", error: error.message });
    }
  };
   

exports.updateVendorApproval = async (req, res) => {
        const { id } = req.params;
        const { approvalStatus } = req.body; 
      
        try {
          const vendor = await User.findByIdAndUpdate(
            id,
            { approvalStatus },
            { new: true }
          );
      
          if (!vendor) {
            return res.status(404).json({ msg: 'Vendor not found' });
          }
      
          res.status(200).json({ msg: `Vendor ${approvalStatus}`, vendor });
        } catch (error) {
          res.status(500).json({ msg: 'Error updating vendor status', error: error.message });
        }
    };
    

    exports.uploadProfileImage = async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
    
        const imageUrl = await uploadToCloudinary(req.file.buffer, "profile_images");
    
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { profileImage: imageUrl },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        res.status(200).json({
          msg: "Profile image uploaded successfully",
          profileImage: user.profileImage,
        });
      } catch (error) {
        console.error("Error in uploadProfileImage:", error);
        res.status(500).json({
          error: "Image upload failed",
          details: error.message,
        });
      }
    };
    
    exports.uploadStoreLogo = async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    
        const imageUrl = await uploadToCloudinary(req.file.buffer, "store_logos");
    
        const vendor = await User.findByIdAndUpdate(
          req.user._id,
          { storeLogo: imageUrl },
          { new: true }
        );
    
        if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    
        res.status(200).json({
          msg: "Store logo uploaded successfully",
          storeLogo: vendor.storeLogo,
        });
      } catch (error) {
        console.error("Error in uploadStoreLogo:", error);
        res.status(500).json({ error: "Image upload failed", details: error.message });
      }
    };
    
  