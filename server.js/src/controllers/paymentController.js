const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
require("dotenv").config();


exports.createPayment = async (req, res) => {
    try {
        const { orderId, customerId, vendorId, amount, paymentMethod } = req.body;
 
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ msg: "Order not found" });

        const payment = new Payment({ orderId, customerId, vendorId, amount, paymentMethod, paymentStatus: "Completed" });
        await payment.save();

        await Order.findByIdAndUpdate(orderId, { orderstatus: "Processing" });

        res.status(201).json({ message: "Payment processed", payment });
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ error: "Payment failed" });
    }
};


exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("orderId  customerId vendorId" );
        res.json(payments);
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ error: "Failed to fetch payments" });
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
        const payment = await Payment.findByIdAndUpdate(paymentId);

        if (!payment) {
            return res.status(404).json({ error: "Payment not found "});
        }
        payment.paymentStatus = "Refunded";
        await payment.save();

        res.status(200).json({ message: "Payment refunded", payment });
    } catch (error) {
        console.error("Error in refundPayment:", error);
        res.status(500).json({ error: "Failed to process refund" });
    }
};
