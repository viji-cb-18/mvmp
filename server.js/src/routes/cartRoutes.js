const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/add",authMiddleware.authenticateUser, cartController.addToCart);
router.get("/:userId",authMiddleware.authenticateUser, cartController.getCart);
router.put("/:userId", authMiddleware.authenticateUser, cartController.updateCartItem);
router.delete("/remove/:productId",authMiddleware.authenticateUser, cartController.removeFromCart);
router.delete("/clear/:cartId",authMiddleware.authenticateUser, cartController.clearCart);

module.exports = router;
