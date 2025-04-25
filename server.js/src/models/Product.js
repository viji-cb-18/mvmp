const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const productSchema = new mongoose.Schema(
  {
    ...masterSchema.obj,
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    
    images: [{ type: String }],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);



