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
        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", paymentStatus, customerId, vendorId } = req.query;

        const filter = {};
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (customerId) filter.customerId = customerId;
        if (vendorId) filter.vendorId = vendorId;

        const payments = await Payment.find()
        .populate("orderId", "totalAmount", "orderStatus" )
        .populate("customerId", "name email" )
        .populate("vendorId", "storeName" )
        .sort({ [sortBy]: order === "asc" ? 1 : -1 }) 
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Payment.countDocuments(filter);

        if (!payments.length) {
            return res.status(404).json({ error: "No payments found" });
        }

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: payments
        });

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
        
        if (payment.paymentStatus === "Refunded") {
            return res.status(400).json({ error: "Payment already refunded" });
        }

        payment.paymentStatus = "Refunded";
        await payment.save();

        res.status(200).json({ message: "Payment refunded", payment });
    } catch (error) {
        console.error("Error in refundPayment:", error);
        res.status(500).json({ error: "Failed to process refund" });
    }
};
