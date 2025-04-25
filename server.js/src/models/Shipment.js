const mongoose = require("mongoose");
const masterSchema =require("./masterModel");


const shipmentSchema = new mongoose.Schema({
    ...masterSchema.obj,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    trackingNumber: { type: String, required: true },
    carrier: { type: String, required: true },
    status: { type: String, enum: ["Processing", "In Transit", "Delivered", "Returned"], default: "Processing" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
});    

module.exports = mongoose.model("Shipment", shipmentSchema);
