const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/", authController.getAllUsers);
router.get("/:userId", authController.getUserById);
router.put("/:userId", authController.updateUser);
router.delete("/:userId", authController.deleteUser);


module.exports = router;
