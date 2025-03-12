const express = require("express");
const paymentController= require("../controllers/paymentController");
const router = express.Router();
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/",authMiddleware.authenticateUser,paymentController.createPayment);
router.get("/",authMiddleware.authenticateUser,authMiddleware.adminOnly, paymentController.getPayments);
router.get("/:paymentId",authMiddleware.authenticateUser,paymentController.getPaymentById);
router.post("/:paymentId/refund",authMiddleware.authenticateUser,authMiddleware.adminOnly, paymentController.refundPayment);

module.exports = router;
