const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.delete("/:cartId/:productId", cartController.removeFromCart);
router.delete("/clear/:cartId", cartController.clearCart);

module.exports = router;
