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

        const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", status, orderId, vendorId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (orderId) filter.orderId = orderId;
        if (vendorId) filter["orderId.vendorId"] = vendorId;

        if (req.user.role === "vendor") {
            filter["orderId.vendorId"] = req.user._id; 
        }

        const shipments = await Shipment.find(filter)
            .populate("orderId", "totalAmount orderStatus")
            .sort({ [sortBy]: order === "asc" ? 1 : -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Shipment.countDocuments(filter);

        if (!shipments.length) {
            return res.status(404).json({ error: "No shipments found" });
        }

        res.status(200).json({
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: shipments
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch shipments", details: error.message });
    }
};

exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.shipmentId).populate("orderId", "totalAmount orderStatus vendorId");

        if (!shipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }

        if (req.user.role === "vendor" && shipment.orderId.vendorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied! You can only view your own shipments" });
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

        const shipment = await Shipment.findById(shipmentId).populate("orderId", "vendorId");

       
        if (!shipment) {
            return res.status(404).json({ error: "Shipment not found" });
        }

        console.log("Shipment Data:", shipment);


        if (!shipment.orderId) {
            return res.status(400).json({ error: "Shipment is missing an associated order" });
        }

        if (req.user.role === "vendor") {
            if (status !== "In Transit") {
                return res.status(403).json({ error: "Vendors can only update shipments to 'In Transit'" });
            }

            if (!shipment.orderId.vendorId || shipment.orderId.vendorId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: "Access denied! You can only update your own shipments" });
            }
        }

        shipment.status = status;
        await shipment.save();

        res.status(200).json({ message: "Shipment status updated successfully", shipment });

    } catch (error) {
        console.error("Error in updateShipmentStatus:", error);
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