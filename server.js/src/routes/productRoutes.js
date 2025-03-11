const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController"); // ✅ Correct import

router.post("/add", productController.addProduct);
router.get("/", productController.getAllProducts); 
router.get("/:productId", productController.getProductById); 
router.delete("/:productId", productController.deleteProduct); 

module.exports = router;
