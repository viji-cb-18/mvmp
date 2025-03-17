const express = require("express");
const vendorController= require("../controllers/vendorController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { uploadMiddleware } = require("../config/cloudinaryconfig");


router.get("/", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.getVendors);
router.get("/:vendorId", authMiddleware.authenticateUser, vendorController.getVendorById);
router.put("/:vendorId", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.updateVendor);
router.post("/upload-store-logo", authMiddleware.authenticateUser, authMiddleware.vendorOnly, uploadMiddleware.single("storeLogo"), vendorController.uploadStoreLogo);
router.delete("/:vendorId", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.deleteVendor);

module.exports = router;
