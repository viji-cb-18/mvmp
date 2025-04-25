const express = require("express");
const orderController= require("../controllers/orderController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

const router = express.Router();

router.post("/create",authMiddleware.authenticateUser,orderController.createOrder);
router.get("/my-orders", authMiddleware.authenticateUser, orderController.getMyOrders);


router.get(
    "/vendor/orders",
    authMiddleware.authenticateUser,
    authMiddleware.vendorOnly,
    orderController.getVendorOrders
  );
  
  
router.get("/",authMiddleware.authenticateUser,authMiddleware.adminOnly,orderController.getAllOrder);
router.get("/:orderId",authMiddleware.authenticateUser, orderController.getOrderById);
router.put("/:orderId/status",authMiddleware.authenticateUser,authMiddleware.vendorOnly, orderController.updateOrderStatus);
router.put("/cancel/:id", authMiddleware.authenticateUser, orderController.cancelOrder);
router.put("/return/:orderId", authMiddleware.authenticateUser, uploadMiddleware.single("image"), orderController.requestReturn);

router.put(
  "/:orderId/return/approve",
  authMiddleware.authenticateUser,
  authMiddleware.vendorOnly,
  orderController.approveReturnRequest
);

router.put(
  "/:orderId/return/reject/:productId",
  authMiddleware.authenticateUser,
  authMiddleware.vendorOnly,
  orderController.rejectReturnRequest
);

router.delete("/:orderId",authMiddleware.authenticateUser,authMiddleware.adminOnly, orderController.deleteOrder);

module.exports = router;