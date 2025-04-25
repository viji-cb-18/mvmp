const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.post(
  "/",
  authMiddleware.authenticateUser,
  authMiddleware.adminOnly,
  uploadMiddleware.single("image"), 
  bannerController.uploadBanner
);

router.get("/", bannerController.getAllBanners);

router.delete(
  "/:id",
  authMiddleware.authenticateUser,
  authMiddleware.adminOnly,
  bannerController.deleteBanner
);

module.exports = router;
