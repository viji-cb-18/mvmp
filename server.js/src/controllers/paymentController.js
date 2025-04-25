const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();


exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: "aed",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
    });
  }
};


exports.createPayment = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      customerId,
      vendorId,
      amount,
      paymentMethod,
      paymentIntentId,
    } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: "Missing productId in request" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log("Stripe paymentIntent status:", paymentIntent?.status);

    const payment = new Payment({
      orderId,
      productId,
      customerId,
      vendorId,
      amount,
      paymentMethod,
      paymentStatus: "Completed",
      stripePaymentId: paymentIntentId,
    });

    await payment.save().catch((err) => {
      console.error("Payment save failed:", err);
      throw err;
    });

    await Order.findByIdAndUpdate(orderId, { orderStatus: "Pending" });

    res.status(201).json({ message: "Payment recorded", payment });
  } catch (error) {
    console.error("Error in createPayment:", error);
    res.status(500).json({ error: "Payment processing failed", details: error.message });
  }
};


exports.getPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalPayments = await Payment.countDocuments();

    const payments = await Payment.find()
      .populate("orderId", "totalAmount orderStatus")
      .populate("customerId", "name email")
      .populate("vendorId", "storeName")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    if (!payments.length) {
      return res.status(404).json({ error: "No payments found" });
    }

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalPayments / limit),
      totalItems: totalPayments,
      data: payments,
    });
  } catch (error) {
    console.error("Error in getPayments:", error.message);
    res.status(500).json({ error: "Failed to fetch payments", details: error.message });
  }
};


exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("orderId", "totalAmount orderStatus")
      .populate("customerId", "name email")
      .populate("vendorId", "storeName");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


exports.refundPayment = async (req, res) => {
    try {
      const { paymentId } = req.params;
  
      const payment = await Payment.findById(paymentId);
      if (!payment || !payment.orderId || !payment.productId) {
        return res.status(400).json({ msg: "Invalid payment data" });
      }
  
      const order = await Order.findById(payment.orderId);
      if (!order) return res.status(404).json({ msg: "Order not found" });
  
      let productUpdated = false;
  
      order.products = order.products.map((item) => {
        if (item.productId.toString() === payment.productId.toString()) {
          productUpdated = true;
          return {
            ...item._doc,
            returnRequested: true,
            returnStatus: "Refunded",
          };
        }
        return item;
      });
  
      if (!productUpdated) {
        return res.status(404).json({ msg: "Product not found in order" });
      }
  
      await order.save();
      payment.paymentStatus = "Refunded";
      await payment.save();
  
      res.json({ msg: "Refunded successfully", order });
    } catch (error) {
      console.error("Refund error:", error);
      res.status(500).json({ msg: "Refund failed", error: error.message });
    }
  };
  


