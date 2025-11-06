const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models"); // <-- Sequelize User modeli

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    console.log("❌ Login error:", err);
    return res.status(500).json({ error: "Server xatosi" });
  }
});

module.exports = router;
