const express = require("express");
const reviewController= require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add",authMiddleware.authenticateUser,reviewController.addReview);
router.get("/", reviewController.getAllReviews);
router.get("/:reviewId", reviewController.getReviewById);
router.put("/:reviewId",authMiddleware.authenticateUser, reviewController.updateReview);
router.delete("/reviewId",authMiddleware.authenticateUser, reviewController.deleteReview);

module.exports = router;