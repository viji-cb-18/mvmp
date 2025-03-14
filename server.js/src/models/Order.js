const mongoose = require("mongoose");
const masterSchema =require("./masterModel");

const orderSchema = new mongoose.Schema({
    ...masterSchema.obj,
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", requied: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true},
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" }

}, { timestamps: true }
);  

module.exports = mongoose.model("Order", orderSchema);
