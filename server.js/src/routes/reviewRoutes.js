const express = require("express");
const reviewController= require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");
const router = express.Router();

router.post("/add",authMiddleware.authenticateUser, uploadMiddleware.single("images"), reviewController.addReview);
router.get("/", reviewController.getAllReviews);
router.get("/:reviewId", reviewController.getReviewById);
router.put("/:reviewId",authMiddleware.authenticateUser, uploadMiddleware.single("images"), reviewController.updateReview);
router.delete("/:reviewId",authMiddleware.authenticateUser, reviewController.deleteReview);
router.post("/upload-image", authMiddleware.authenticateUser, uploadMiddleware.array("images", 5), reviewController.addReview);


module.exports = router;