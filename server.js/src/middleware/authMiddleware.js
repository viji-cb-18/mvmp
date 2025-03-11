const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Acess Denied. No token provided."});
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token"});
    }
};


const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Acess Denied. Vendors only."});
    }
    next();
};


const customerMiddleware = (req, res, next) => {
    if (req.user.role !== "customer") {
        return res.status(403).json({ error: "Acess Denied. Customers only."});
    }
    next();
};


const vendorMiddleware = (req, res, next) => {
    if (req.user.role !== "vendor") {
        return res.status(403).json({ error: "Acess Denied. Vendors only."});
    }
    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    vendorMiddleware,
    customerMiddleware
};