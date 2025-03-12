const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now }, 
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false 
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isActive: { type: Boolean, default: true } 
},
{ timestamps: true } 
);

module.exports = masterSchema;
