const express = require("express");
const orderController= require("../controllers/orderController");
//const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create",orderController.createOrder);
router.get("/",orderController.getOrder);
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId/status", orderController.updateOrderStatus);
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;