const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const { cloudinary } = require("../config/cloudinaryconfig");


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, createdBy } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ msg: "All fields are required" });
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
            role,
            createdBy: role === "admin" ? null : createdBy 
        });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
};


exports.loginUser = async (req, res) => {
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

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ msg: "Logout successful. Token invalidated on the client side." });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.getUserById =async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.updateUser =async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
            return res.status(403).json({ msg: "Access denied!" });
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(userId, req.body, {new: true});
        if (!updateUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ msg: "User updated successfully", updateUser });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Old and new passwords are required" });
        }

        const user = await User.findById(req.user_id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isMatch = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        console.error("Error in changedpassword:", error);
        res.status(500).json({ error: "Failed to update password" });

    }
}

exports.deleteUser =async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.user._id.toString() === userId) {
            return res.status(403).json({ msg: "You cannot delete your own account!" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Access denied! Admins only" });
        }

        const deleteUser = await User.findByIdAndDelete(userId);
        if (!deleteUser) return res.status(404).json({ error: "User not found" });

        res.status(200).json({ msg: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const user = await User.findByIdAndUpdate(req.user_id, { profileImage: req.file.path}, { new: true });

        res.staus(200).json({ msg: "Profile image uploaded successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Image uploaded failed", details: error.message });
    }
}

