const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.post("/parent",authMiddleware.authenticateUser,authMiddleware.adminOnly, uploadMiddleware.single("image"), categoryController.addParentCategory);
router.post("/sub",authMiddleware.authenticateUser,authMiddleware.adminOnly, uploadMiddleware.single("image"), categoryController.addSubCategory);
router.get("/", categoryController.getCategory);
router.get("/all", categoryController.getAllFlatCategories);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", authMiddleware.authenticateUser, authMiddleware.adminOnly, uploadMiddleware.single("image"), categoryController.updateCategory);
router.delete("/:categoryId", authMiddleware.authenticateUser, authMiddleware.adminOnly, categoryController.deleteCategory);

module.exports = router;
