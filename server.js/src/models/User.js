const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const userSchema = new mongoose.Schema({
  ...masterSchema.obj,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
 

  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    required: true,
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  storeName: { type: String },
  storeLogo: { type: String },
  description: { type: String },

  profileImage: { type: String },
}, { timestamps: true });

userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.createdBy = undefined;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
