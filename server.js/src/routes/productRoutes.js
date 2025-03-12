const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/add",authMiddleware.authenticateUser,authMiddleware.adminOnly, productController.addProduct);
router.get("/", productController.getAllProducts); 
router.get("/:productId", productController.getProductById);
router.put("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.updateProduct); 
router.delete("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.deleteProduct); 

module.exports = router;
