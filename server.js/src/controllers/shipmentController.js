const Shipment = require("../models/Shipment");
const Order = require("../models/Order");

exports.createShipment = async (req, res) => {
    try {
        const { orderId, trackingNumber, carrier, status } = req.body;

        if (!orderId || !trackingNumber || !carrier) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ error: "Order not found" });

        const newShipment = new Shipment({ orderId, trackingNumber, carrier, status: status || "Processing" });
        await newShipment.save();

        res.status(201).json({ message: "Shipment created successfully", shipment: newShipment });
    } catch (error) {
        res.status(500).json({ error: "Failed to create shipment", details: error.message });
    }
};

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().populate("orderId", "totalAmount orderStatus");

        if (!shipments || shipments.length === 0) {
            return res.status(404).json({ error: "No shipments found" });
        }

        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shipments", details: error.message });
    }
};

exports.getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().populate("orderId", "totalAmount orderStatus");

        if (!shipments || shipments.length === 0) {
            return res.status(404).json({ error: "No shipments found" });
        }

        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shipments", details: error.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.shipmentId).populate("orderId", "totalAmount orderStatus");

        if (!shipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.updateShipmentStatus = async (req, res) => {
    try {
        const { shipmentId } = req.params;
        const { status } = req.body;

        const updatedShipment = await Shipment.findByIdAndUpdate(shipmentId, { status }, { new: true });

        if (!updatedShipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }

        res.status(200).json({ message: "Shipment status updated successfully", updatedShipment });
    } catch (error) {
        res.status(500).json({ error: "Failed to update shipment status", details: error.message });
    }
};

exports.deleteShipment = async (req, res) => {
    try {
        const deletedShipment = await Shipment.findByIdAndDelete(req.params.shipmentId);

        if (!deletedShipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }

        res.status(200).json({ message: "Shipment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete shipment", details: error.message });
    }
};