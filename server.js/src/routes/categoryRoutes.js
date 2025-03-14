const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware  = require("../middleware/authMiddleware");
const { uploadMiddleware } = require("../config/cloudinaryconfig");

router.post("/",authMiddleware.authenticateUser,authMiddleware.adminOnly, categoryController.addCategory);
router.get("/", categoryController.getCategory);
router.get("/:categoryId", categoryController.getCategoryById);
router.put("/:categoryId", authMiddleware.authenticateUser, authMiddleware.adminOnly, categoryController.updateCategory);
router.post("/:categoryId/upload-image", authMiddleware.authenticateUser, authMiddleware.adminOnly, uploadMiddleware.single("image"), categoryController.uploadCategoryImage);
router.delete("/:categotyId", authMiddleware.authenticateUser, authMiddleware.adminOnly, categotyController.deleteCategory);

module.exports = router;
