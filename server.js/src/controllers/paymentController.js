const Payment = require("../models/Payment");
const Order = require("../models/Order");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
require("dotenv").config();

//Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { orderId, customerId, vendorId, amount, paymentMethod } = req.body;

        if (!orderId || !customerId || !vendorId || !amount || !paymentMethod) {
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const payment = new Payment({ orderId, customerId, vendorId, amount, paymentMethod, paymentStatus: "Completed" });
        await payment.save();

        res.status(201).json({ message: "Payment processed", payment });
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ error: "Payment failed" });
    }
};

//Get all payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate("orderId  customerId vendorId" );
        res.json(payments);
    } catch (error) {
        console.error("Error in createPayment:", error);
        res.status(500).json({ error: "Failed to fetch payments" });
    }
};

//Refund Payment
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
