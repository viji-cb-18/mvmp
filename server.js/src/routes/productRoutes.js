const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");


router.post("/add",authMiddleware.authenticateUser,authMiddleware.vendorOnly, uploadMiddleware.array("images", 5), productController.addProduct);
router.put("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.updateProduct); 
router.delete("/:productId",authMiddleware.authenticateUser,authMiddleware.vendorOnly, productController.deleteProduct); 

router.post("/upload-images", authMiddleware.authenticateUser, authMiddleware.vendorOnly, uploadMiddleware.array("images", 5), productController.uploadProductImage);

router.get("/:productId", productController.getProductById);
router.get("/products", productController.getAllProducts); 
router.get("/product/category/:categoryId",productController.getProductsByCategory );
router.get("/product/vendor/:vendorId", productController.getProductsByVendor)

router.get("/best-sellers", productController.getBestSellingProducts);

module.exports = router;
