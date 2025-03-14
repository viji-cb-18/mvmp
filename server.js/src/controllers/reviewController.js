const Review =require("../models/Review");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinaryconfig");


exports.addReview = async (req, res) => {
    try {
        const { userId, productId, rating,comment } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ error: "Product ID and rating are required" });
        }

        const review = new Review({ 
            userId: req.user._id,
            productId, 
            rating, 
            comment 
        });

        await review.save();
        res.status(201).json({ message: "Review added successfully", review});
    } catch (error) {
        res.status(500).json({ error: "Failed to add review "});
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", productId } = req.query;

        const filter = {};
        if (productId) filter.productId = productId;

        const reviews = await Review.find(filter)
            .populate("userId", "name email")
            .populate("productId", "name price")
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Review.countDocuments(filter);    

        if (!reviews.length) {
            return res.status(404).json({ error: "No reviews found" });
        }

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: reviews
        });
    } catch (error) {
        console.error("Error in getAllReviews:", error.message);
        res.status(500).json({ error: "Failed to fetch reviews", details: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId)
            .populate("userId", "name email")
            .populate("productId", "name");

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(reviewId);

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== updatedReview.userId.toString()) {
            return res.status(403).json({ error: "Access denied! You can only update your own reviews" });
        }

        updatedReview.rating = rating || updatedReview.rating;
        updatedReview.comment = comment || updatedReview.comment;
        await updatedReview.save();

        res.status(200).json({ message: "Review updated successfully", updatedReview });
    } catch (error) {
        res.status(500).json({ error: "Failed to update review", details: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const deletedReview = await Review.findByIdAndDelete(reviewId);

        if (!deletedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== deletedReview.userId.toString()) {
            return res.status(403).json({ error: "Access denied! You can only delete your own reviews" });
        }

        await deletedReview.deleteOne();

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error.message });
    }
};