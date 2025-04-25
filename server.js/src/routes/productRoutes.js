const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.get("/all", productController.getAllProducts);
router.get("/best-sellers", productController.getBestSellingProducts);

router.get(
  "/category/:categoryId",
  authMiddleware.authenticateUser,
  productController.getProductsByCategory
);

router.get(
  "/vendor/:vendorId",
  authMiddleware.authenticateUser,
  authMiddleware.vendorOnly,
  productController.getProductsByVendor
);

router.get(
  "/:id", productController.getProductById
);

router.post(
  "/add",
  authMiddleware.authenticateUser,
  authMiddleware.vendorOnly,
  uploadMiddleware.array("images", 5),
  productController.addProduct
);

router.put(
  "/:productId",
  authMiddleware.authenticateUser,
  authMiddleware.adminOrVendor,
  uploadMiddleware.array("images", 5),
  productController.updateProduct
);

router.delete(
  "/:productId",
  authMiddleware.authenticateUser,
  authMiddleware.adminOrVendor,
  productController.deleteProduct
);

router.post(
  "/upload-images",
  authMiddleware.authenticateUser,
  authMiddleware.vendorOnly,
  uploadMiddleware.array("images", 5),
  productController.uploadProductImage
);

module.exports = router;
