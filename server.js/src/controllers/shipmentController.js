const Shipment = require("../models/Shipment");
const Order = require("../models/Order");

exports.createShipment = async (req, res) => {
    try {
      const newShipment = await Shipment.create(req.body);
      res.status(201).json({ success: true, data: newShipment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating shipment" });
    }
  };
  
  exports.getShipments = async (req, res) => {
    try {
      const shipments = await Shipment.find()
        .populate({
          path: "orderId",
          select: "totalAmount orderStatus vendorId",
          match: req.user.role === "vendor" ? { vendorId: req.user._id } : {},
        });
  
      const filtered = shipments.filter(s => s.orderId !== null); 
  
      res.json({ success: true, data: filtered });
    } catch (err) {
      console.error("Error fetching shipments:", err);
      res.status(500).json({ success: false, message: "Error fetching shipments" });
    }
  };
  
  
  exports.getShipmentById = async (req, res) => {
    try {
      const shipment = await Shipment.findById(req.params.shipmentId);
      res.json({ success: true, data: shipment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Shipment not found" });
    }
  };
  

  exports.updateShipmentStatus = async (req, res) => {
    try {
      const shipment = await Shipment.findByIdAndUpdate(
        req.params.shipmentId,
        { status: req.body.status },
        { new: true }
      );
      res.json({ success: true, data: shipment });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating status" });
    }
  };
  

  exports.deleteShipment = async (req, res) => {
    try {
      await Shipment.findByIdAndDelete(req.params.shipmentId);
      res.json({ success: true, message: "Shipment deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting shipment" });
    }
  };