const express = require("express");
const paymentController= require("../controllers/paymentController");
const router = express.Router();
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/create",authMiddleware.authenticateUser,paymentController.createPayment);
router.get("/",authMiddleware.authenticateUser,authMiddleware.adminOnly, paymentController.getPayments);
router.get("/:paymentId",authMiddleware.authenticateUser,paymentController.getPaymentById);
router.post("/:paymentId/refund",authMiddleware.authenticateUser,authMiddleware.vendorOnly, paymentController.refundPayment);
router.post("/create-intent", paymentController.createPaymentIntent);
module.exports = router;
