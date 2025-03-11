const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, createdBy } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
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
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
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
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
     } catch (error) {
        res.status(500).json({ error: "Internal server error", details: error.message });
     }
}

