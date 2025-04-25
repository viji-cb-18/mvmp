const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const orderSchema = new mongoose.Schema({
  ...masterSchema.obj,

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      returnRequested: { type: Boolean, default: false }, 
      returnStatus: {
        type: String,
        enum: ["Requested", "Approved", "Refunded"],
        default: "Requested"
      },
      returnReason: { type: String, default: "" },  
      returnImage:  {type: String },
      returnRequestedAt: { type: Date, },
 
    },
  ],

  totalAmount: { type: Number, required: true },

  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },

  

  shippingAddress: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
