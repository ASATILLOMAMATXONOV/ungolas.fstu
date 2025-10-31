const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const menuRoutes = require("./routes/menuRoutes");

const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 Routes
app.use("/api/menus", menuRoutes); // ✅ faqat bitta marta ulanadi!

// 🔹 DB bilan sinxronizatsiya
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synchronized");
});

// 🔹 Serverni ishga tushirish
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
