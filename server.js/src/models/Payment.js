const mongoose = require("mongoose");
const masterSchema =require("./masterModel");

const paymentSchema = new mongoose.Schema({
    ...masterSchema.obj,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Pending"},
    payoutStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    stripePaymentId: { type: String, required: true },
    
}, { timestamps: true }
);    

module.exports = mongoose.model("Payment", paymentSchema);
