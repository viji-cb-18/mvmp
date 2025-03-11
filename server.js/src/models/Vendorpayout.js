const mongoose = require("mongoose");
const masterSchema =require("./masterModel");

const vendorpayoutSchema = new mongoose.Schema({
    ...masterSchema.obj,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    payoutStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending"}
    
    
});

module.exports = mongoose.model("VendorPayout", vendorpayoutSchema);
