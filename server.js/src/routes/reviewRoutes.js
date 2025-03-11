const express = require("express");
const reviewController= require("../controllers/reviewController");
//const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", reviewController.addReview);
router.get("/", reviewController.getAllReviews);

module.exports = router;