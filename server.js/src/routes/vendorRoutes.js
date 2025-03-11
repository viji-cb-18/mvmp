const express = require("express");
const vendorController= require("../controllers/vendorController");
//const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

//router.get("/", authMiddleware, adminMiddleware, getVendors);
router.post("/add", vendorController.addVendor);
router.get("/", vendorController.getVendors);

module.exports = router;
