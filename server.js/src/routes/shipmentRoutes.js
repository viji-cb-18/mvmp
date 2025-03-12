const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/",authMiddleware.authenticateUser,authMiddleware.adminOnly, shipmentController.createShipment);
router.get("/",authMiddleware.authenticateUser, shipmentController.getShipments);
router.get("/:shipmentId",authMiddleware.authenticateUser, shipmentController.getShipmentById);
router.put("/:shipmentId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, shipmentController.updateShipmentStatus);
router.delete("/:shipmentId",authMiddleware.authenticateUser,authMiddleware.adminOnly, shipmentController.deleteShipment);

module.exports = router;
