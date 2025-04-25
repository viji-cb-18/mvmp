const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const userSchema = new mongoose.Schema({
  ...masterSchema.obj,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  paymentMethod: { type: String },
  

  role: {
    type: String,
    enum: ["customer", "vendor", "admin"],
    //required: true,
    default: "customer",
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
