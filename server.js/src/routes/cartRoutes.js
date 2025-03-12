const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/add",authMiddleware.authenticateUser, cartController.addToCart);
router.get("/:userId",authMiddleware.authenticateUser, cartController.getCart);
router.delete("/:cartId/:productId",authMiddleware.authenticateUser, cartController.removeFromCart);
router.delete("/clear/:cartId",authMiddleware.authenticateUser, cartController.clearCart);

module.exports = router;
