const express = require("express");
const vendorController= require("../controllers/vendorController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.getVendors);
router.get("/:vendorId", authMiddleware.authenticateUser, vendorController.getVendorById);
router.put("/:vendorId", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.updateVendor);
router.delete("/:vendorId", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.deleteVendor);

module.exports = router;
