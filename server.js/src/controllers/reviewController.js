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