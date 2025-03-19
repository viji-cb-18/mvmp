const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.post("/parent",authMiddleware.authenticateUser,authMiddleware.adminOnly, uploadMiddleware.single("image"), categoryController.addParentCategory);
router.post("/sub",authMiddleware.authenticateUser,authMiddleware.vendorOnly, uploadMiddleware.single("image"), categoryController.addSubCategory);
router.get("/", categoryController.getCategory);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", authMiddleware.authenticateUser, authMiddleware.vendorOnly, uploadMiddleware.single("image"), categoryController.updateCategory);
router.delete("/:categoryId", authMiddleware.authenticateUser, authMiddleware.vendorOnly, categoryController.deleteCategory);

module.exports = router;
