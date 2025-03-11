const mongoose = require("mongoose");
const masterSchema =require("./masterModel");

const cartSchema = new mongoose.Schema({
    ...masterSchema.obj,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, default: 1, min: 1 },
            price: { type: Number, required: true }

        }
    ], 
    totalPrice: { type: Number, required: true, default: 0 },

}, { timestamps: true });    

module.exports = mongoose.model("Cart", cartSchema);
