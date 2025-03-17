const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", authMiddleware.authenticateUser, authController.logoutUser);
router.post("/profile", authMiddleware.authenticateUser, uploadMiddleware.single("profileImage"), authController.uploadProfileImage)
router.get("/",authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.getAllUsers);
router.get("/:userId",authMiddleware.authenticateUser, authController.getUserById);
router.put("/:userId",authMiddleware.authenticateUser, authController.updateUser);
router.put("/change-password", authMiddleware.authenticateUser, authController.changePassword);
router.delete("/:userId",authMiddleware.authenticateUser, authMiddleware.adminOnly, authController.deleteUser);

module.exports = router;
