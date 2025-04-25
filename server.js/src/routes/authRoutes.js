const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/profile",authMiddleware.authenticateUser, authController.getProfile);
router.put("/update-profile",authMiddleware.authenticateUser, authController.updateProfile);
router.put("/change-password", authMiddleware.authenticateUser, authController.changePassword);
router.post(
    "/upload-profile-image",
    authMiddleware.authenticateUser,
    uploadMiddleware.single("profileImage"), 
    authController.uploadProfileImage
  );

router.get("/users",authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.getAllUsers);
router.get("/users/:userId",authMiddleware.authenticateUser, authController.getUserById);
router.delete("/users/:userId",authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.deleteUser);

router.get("/vendors", authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.getAllVendors);
router.put("/approve/:id", authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.updateVendorApproval);
router.get("/pending-vendors", authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.getPendingVendors);

router.post(
    "/vendor/store-logo",
    authMiddleware.authenticateUser,
    uploadMiddleware.single("image"),
    authController.uploadStoreLogo
  );
  


module.exports = router;

