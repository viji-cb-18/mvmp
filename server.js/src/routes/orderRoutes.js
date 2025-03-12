const express = require("express");
const orderController= require("../controllers/orderController");
const authMiddleware  = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create",authMiddleware.authenticateUser,orderController.createOrder);
router.get("/",authMiddleware.authenticateUser,authMiddleware.adminOnly,orderController.getOrder);
router.get("/:orderId",authMiddleware.authenticateUser, orderController.getOrderById);
router.put("/:orderId/status",authMiddleware.authenticateUser,authMiddleware.vendorOnly, orderController.updateOrderStatus);
router.delete("/:orderId",authMiddleware.authenticateUser,authMiddleware.adminOnly, orderController.deleteOrder);

module.exports = router;