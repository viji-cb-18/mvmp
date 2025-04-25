const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { authenticateUser, adminOnly } = require("../middleware/authMiddleware");

router.post("/", contactController.submitContact);
router.get("/", authenticateUser, adminOnly, contactController.getAllContacts);

module.exports = router;
