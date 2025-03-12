const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authMiddleware  = require("../middleware/authMiddleware");

router.post("/",authMiddleware.authenticateUser,authMiddleware.adminOnly, categoryController.addCategory);
router.get("/", categoryController.getCategory);
router.get("/:categoryId", categoryController.getCategory);
router.put("/:categoryId", authMiddleware.authenticateUser, authMiddleware.adminOnly, categoryController.updateCategory);
router.delete("/:categotyId", authMiddleware.authenticateUser, authMiddleware.adminOnly, categotyController.deleteCategory);

module.exports = router;
