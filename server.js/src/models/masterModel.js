const mongoose = require("mongoose");

const masterSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now }, // ✅ Fixed default value
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false // ✅ Removed incorrect condition
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {  // ✅ Fixed inconsistent naming
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    isActive: { type: Boolean, default: true } // ✅ Changed `isactive` to camelCase
},
{ timestamps: true } // ✅ This enables automatic createdAt & updatedAt
);

module.exports = masterSchema;
