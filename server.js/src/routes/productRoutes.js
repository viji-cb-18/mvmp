const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");


router.post("/add",authMiddleware.authenticateUser,authMiddleware.vendorOnly, uploadMiddleware.array("images", 5), productController.addProduct);
router.get("/", productController.getAllProducts); 
router.get("/:productId", productController.getProductById);
router.put("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.updateProduct); 
router.post("/upload-images", authMiddleware.authenticateUser, authMiddleware.vendorOnly, uploadMiddleware.array("images", 5), productController.uploadProductImage);
router.delete("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.deleteProduct); 

module.exports = router;
