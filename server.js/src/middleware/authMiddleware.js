const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.authenticateUser = async (req, res, next) => {
    try {
  
      console.log("Request Headers:", req.headers);

      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (!authHeader) {
        return res.status(401).json({ msg: "Access denied! No token provided" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "Token missing in Authorization header" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
  
      if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized! User not found" });
      }
  
      next();
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(401).json({ msg: "Invalid or expired token" });
    }
  };

  exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied! Admins only" });
    }
    next();
};

exports.vendorOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "vendor") {
        return res.status(403).json({ msg: "Access denied! Vendors only" });
    }
    next();
};

exports.adminOrVendor = (req, res, next) => {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "vendor")) {
        return res.status(403).json({ msg: "Access denied! Admins or Vendors only" });
    }
    next();
};

exports.authorize = (role) => {
  return (req, res, next) => {
      if (req.user.role !== role) {
          return res.status(403).json({ msg: 'User role not authorized' });
      }
      next();
  };
};