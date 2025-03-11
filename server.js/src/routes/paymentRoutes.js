const express = require("express");
const paymentController= require("../controllers/paymentController");
const router = express.Router();

router.post("/", paymentController.createPayment);
router.get("/", paymentController.getPayments);
router.post("/:paymentId/refund", paymentController.refundPayment);

module.exports = router;
