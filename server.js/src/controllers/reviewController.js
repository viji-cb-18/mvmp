const Review =require("../models/Review");

exports.addReview = async (req, res) => {
    try {
        const { userId, productId, rating,comment } = req.body;
        const review = new Review({ userId,productId, rating, comment });
        await review.save();
        res.status(201).json({ message: "Review added successfully", review});
    } catch (error) {
        res.status(500).json({ error: "Failed to add review "});
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("userId", "name email")
            .populate("productId", "name price");

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ error: "No reviews found" });
        }

        res.status(200).json(reviews);
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

        const updatedReview = await Review.findByIdAndUpdate(reviewId, { rating, comment }, { new: true });

        if (!updatedReview) {
            return res.status(404).json({ error: "Review not found" });
        }

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

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete review", details: error.message });
    }
};