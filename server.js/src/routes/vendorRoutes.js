/*const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController"); 
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

//router.post('/register', vendorController.registerVendor);
router.get(
    "/admin/pending-vendors",
    authMiddleware.authenticateUser,
    authMiddleware.adminOnly,
    vendorController.getPendingVendors
  );
  
  router.get(
    "/approved-vendors",
    authMiddleware.authenticateUser,
    authMiddleware.adminOnly,
    vendorController.getApprovedVendors
  );
  
  
router.get("/", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.getAllVendors);
router.delete("/:vendorId", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.deleteVendor);

router.put('/approve/:vendorId', authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.approveVendor);

router.get("/profile", authMiddleware.authenticateUser, authMiddleware.vendorOnly, vendorController.getVendorProfile);

router.put("/update", authMiddleware.authenticateUser, authMiddleware.vendorOnly, vendorController.updateVendorProfile);
router.put("/change-password", authMiddleware.authenticateUser, authMiddleware.vendorOnly, vendorController.changeVendorPassword);
router.post("/upload-store-logo", authMiddleware.authenticateUser, authMiddleware.vendorOnly, uploadMiddleware.single("storeLogo"), vendorController.uploadStoreLogo);
router.put("/store-info", authMiddleware.authenticateUser, authMiddleware.vendorOnly, vendorController.manageStoreInfo);
router.get("/performance-report", authMiddleware.authenticateUser, authMiddleware.adminOnly, vendorController.getVendorPerformanceReport);

module.exports = router;*/

