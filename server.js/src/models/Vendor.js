const mongoose = require("mongoose");
const masterSchema =require("./masterModel");

const vendorSchema = new mongoose.Schema({
    ...masterSchema.obj,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true },
    description: { type: String },
    registrationStatus: { type: String, enum: ["pending","approved","rejected"], default: "pending"},
    storeLogo: { type: String },
    contactNumber: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 }
},{ timestamps: true }
);    

module.exports = mongoose.model("Vendor", vendorSchema);