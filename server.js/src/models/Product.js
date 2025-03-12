const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const productSchema = new mongoose.Schema(
    {
    ...masterSchema.obj,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);


