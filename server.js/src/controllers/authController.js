const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");


/*exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role, createdBy } = req.body;

        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        /*if (!phone.match(/^\d{10}$/)) {
            return res.status(400).json({ msg: "Phone number must be 10 digits" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
};*/

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

  
/*exports.getAllUsers = async (req, res) => {
     try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied! Admin only" });
        }

        const { page = 1, limit = 10, role, sortBy = "createdAt", order = "desc" } = req.query;

        const filter = {};
        if (role) filter.role = role;

        const users = await User.find(filter, { password: 0 })
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await User.countDocuments(filter);

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: users
        });

     } catch (error) {
        res.status(500).json({ msg: "Internal server error", details: error.message });
     }
}
*/

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


exports.getUserprofile =async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error on getuserprofile ", error);
        res.status(500).json({ msg: "Internal server error" });
    }
}

exports.updateUserProfile =async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: "Unauthorized! User not found" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "User updated successfully", updatedUser });
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword , confirmNewPassword } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(req.user._id);
    
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Incorrect old password" });
        }

        if (newPassword !== confirmNewPassword) return res.status(400).json({ error: "Passwords do not match" });

        if (newPassword.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters long" });

        user.password = await bcrypt.hash(newPassword,10) 

        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        console.error("Error in changedpassword:", error);
        res.status(500).json({ error: "Failed to update password" });

    }
}



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
  
  
  // Update vendor approval status
  /*exports.updateVendorApproval = async (req, res) => {
    try {
      const { id } = req.params;
      const { approvalStatus } = req.body;
      const updatedVendor = await User.findByIdAndUpdate(
        id,
        { approvalStatus },
        { new: true }
      );
      res.status(200).json(updatedVendor);
    } catch (error) {
      console.error("Error updating vendor approval:", error);
      res.status(500).json({ error: "Failed to update vendor approval" });
    }
  };
  */
  exports.updateVendorApproval = async (req, res) => {
    const { id } = req.params;
    const { approvalStatus } = req.body; // expected: "approved" or "rejected"
  
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
      res
        .status(500)
        .json({ msg: "Error updating vendor status", error: error.message });
    }
  };
  

  // authController.js

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
    const { approvalStatus } = req.body; // "approved" or "rejected"
  
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
        const { approvalStatus } = req.body; // expected: "approved" or "rejected"
      
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

     
        const imageUrl = await uploadToCloudinary(req.file.buffer);

     
        const user = await User.findByIdAndUpdate(
            req.user._id, 
            { profileImage: imageUrl }, 
            { new: true }
        );


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

      
        res.status(200).json({ msg: "Profile image uploaded successfully", profileImage: user.profileImage });
    } catch (error) {
        console.error("Error in uploadProfileImage:", error);
        res.status(500).json({ error: "Image upload failed", details: error.message });
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
      console.error("Error in updateVendorProfile:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  // ✅ Upload store logo (Cloudinary)
  exports.uploadStoreLogo = async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
      const imageUrl = await uploadToCloudinary(req.file.buffer); // if using memory storage
  
      const vendor = await User.findByIdAndUpdate(req.user._id, { storeLogo: imageUrl }, { new: true });
  
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
  
      res.status(200).json({ msg: "Store logo uploaded successfully", vendor });
    } catch (error) {
      res.status(500).json({ error: "Image upload failed", details: error.message });
    }
  };
  
  // ✅ Manage vendor store info (if separate from profile)
  exports.manageStoreInfo = async (req, res) => {
    try {
      const vendor = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
  
      if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  
      res.status(200).json({ message: "Store information updated successfully", vendor });
    } catch (error) {
      res.status(500).json({ error: "Failed to update store info", details: error.message });
    }
  };
