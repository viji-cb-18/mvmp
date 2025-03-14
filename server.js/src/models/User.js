const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const userSchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "vendor", "admin"], required: true },
    address: { type: String },
    phone: { type: String },
    profileImage: { type: String } 
})

userSchema.pre("save", function (next) {
    if (this.role === "admin") {
        this.createdBy = undefined;  
    }
    next();
});

module.exports = mongoose.model("User", userSchema);

