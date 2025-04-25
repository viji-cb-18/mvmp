const Review =require("../models/Review");
const multer = require("multer");
const { cloudinary } = require("../config/cloudinaryconfig");
const Product = require("../models/Product");

exports.addReview = async (req, res) => {
    try {
      const { productId, rating, comment } = req.body;
  
      if (!productId || !rating) {
        return res.status(400).json({ error: "Product ID and rating are required" });
      }
  
      const reviewData = {
        userId: req.user._id,
        productId,
        rating,
        comment,
      };
  
      if (req.file) {
        const uploadedImage = await uploadToCloudinary(req.file.path);
        reviewData.image = uploadedImage;
      }
  
      const review = new Review(reviewData);
      await review.save();
  
      const reviews = await Review.find({ productId });
      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = totalRating / totalReviews;
  
      await Product.findByIdAndUpdate(productId, {
        averageRating,
        totalReviews,
      });
  
      res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Failed to add review:", error.message || error);
        res.status(500).json({ error: "Failed to add review", details: error.message });
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


exports.getReviewsByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const reviews = await Review.find({ productId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
  
      res.status(200).json({ data: reviews });
    } catch (error) {
      console.error("Error fetching reviews by productId:", error.message);
      res.status(500).json({ error: "Failed to fetch product reviews", details: error.message });
    }
  };
  

exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findByIdAndUpdate(reviewId);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== review.userId.toString()) {
            return res.status(403).json({ error: "Access denied! You can only update your own reviews" });
        }

        if (rating)  review.rating = rating;
        if (comment) review.comment = comment;

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(req.file.path);
            review.image = uploadedImage;
        }

        await review.save();

        res.status(200).json({ message: "Review updated successfully", review });
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


exports.uploadReviewImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const uploadedImage = await uploadToCloudinary(req.file.path);

        const review = await Review.findByIdAndUpdateO(
            req.params.reviewId,
            { image: uploadedImage },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

       res.status(200).json({ message: "Review image uploaded successfully", imageUrl: uploadedImage});
    } catch (error) {
        res.status(500).json({ error: "Image upload failed", details: error.message });
    }

};
