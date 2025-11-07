const { User } = require("../models/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: "Username noto‘g‘ri" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Parol noto‘g‘ri" });

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1d" });

    res.json({ token });
};
