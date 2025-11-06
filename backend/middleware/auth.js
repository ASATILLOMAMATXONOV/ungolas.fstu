const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1] || req.query.token || req.headers["x-access-token"];

  if (!token) return res.status(401).json({ error: "Token topilmadi." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan." });
  }
};
