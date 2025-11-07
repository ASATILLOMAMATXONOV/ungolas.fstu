const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const fs = require("fs");
const path = require("path");

const menuRoutes = require("./routes/menuRoutes");
const submenuRoutes = require("./routes/submenuRoutes");
const homeTitleRoutes = require("./routes/homeTitleRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const pageRoutes = require("./routes/pageRoutes");
const componentRoutes = require("./routes/componentRoutes");
const authRoutes = require("./routes/auth");


const newPageRoutes = require("./routes/newPageRoutes");
const app = express();

// 📁 uploads papkasini avtomatik yaratish
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 uploads papkasi yaratildi");
}

// 🔹 Middlewares
app.use(cors());
app.use(express.json({ limit: "1000mb" }));  // ~1GB
app.use(express.urlencoded({ limit: "1000mb", extended: true, parameterLimit: 1000000 }));

app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});
app.use("/uploads", express.static("uploads")); // rasm ko‘rsatish uchun
app.use("/api/upload", uploadRoutes);


// 🔹 Routes
app.use("/api/menus", menuRoutes);        // Menyular uchun
app.use("/api/submenus", submenuRoutes);  // Submenyular uchun
app.use("/api/home-titles", homeTitleRoutes); // ✅ To‘g‘ri yo‘l
app.use("/api/banners", bannerRoutes);    // Bannerlar uchun
app.use("/api/pages", pageRoutes);        // Sahifalar uchun
app.use("/api/components", componentRoutes); // Komponentlar uchun
app.use("/api/new-pages", newPageRoutes); // Yangi sahifalar uchun



app.use("/api/auth", authRoutes);  // <-- MUHIM

// 🔹 DB bilan sinxronizatsiya
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synchronized");
});

// 🔹 Serverni ishga tushirish
const PORT = 1684;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
