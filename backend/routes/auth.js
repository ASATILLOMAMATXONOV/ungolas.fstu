const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// ✅ To'g'ri path
router.post("/login", login);

module.exports = router;
