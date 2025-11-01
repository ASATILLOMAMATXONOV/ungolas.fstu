// 🔹 Kerakli modullarni import qilamiz
const { Banner } = require("../models");
const fs = require("fs");
const path = require("path");

/* ======================================================================
   🟩 1. Barcha bannerlarni olish  =>  GET /api/banners
   ====================================================================== */
exports.getAll = async (req, res) => {
  try {
    // 🔸 Barcha bannerlarni id bo‘yicha teskari tartibda (yangi birinchi)
    const banners = await Banner.findAll({ order: [["id", "DESC"]] });

    res.json(banners); // ✅ Natijani JSON ko‘rinishida yuboramiz
  } catch (err) {
    console.error("❌ getAll xatosi:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================================
   🟦 2. Yangi banner yaratish  =>  POST /api/banners
   ====================================================================== */
exports.create = async (req, res) => {
  try {
    const files = req.files; // 🔹 Multer orqali yuklangan fayllar (har til uchun alohida)

    // 🔹 Banner modelida yangi yozuv yaratamiz
    const banner = await Banner.create({
      title_uz: req.body.title_uz,
      title_ru: req.body.title_ru,
      title_en: req.body.title_en,
      link: req.body.link,

      // 🔹 Agar fayl mavjud bo‘lsa — manzilini DBga yozamiz
      image_uz: files.image_uz ? `/uploads/${files.image_uz[0].filename}` : null,
      image_ru: files.image_ru ? `/uploads/${files.image_ru[0].filename}` : null,
      image_en: files.image_en ? `/uploads/${files.image_en[0].filename}` : null,
    });

    res.status(201).json({
      message: "✅ Yangi banner muvaffaqiyatli yaratildi",
      banner,
    });
  } catch (err) {
    console.error("❌ create xatosi:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================================
   🟨 3. Banner yangilash  =>  PUT /api/banners/:id
   ====================================================================== */
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const files = req.files;

    // 🔹 Avval banner mavjudligini tekshiramiz
    const banner = await Banner.findByPk(id);
    if (!banner) return res.status(404).json({ error: "Banner topilmadi" });

    // 🔹 Eski rasmni o‘chirish uchun yordamchi funksiya
    const deleteOldFile = (oldPath) => {
      if (oldPath) {
        const absPath = path.join(__dirname, "../", oldPath);
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      }
    };

    // 🔹 Yangilanishi kerak bo‘lgan maydonlar
    const updatedData = {
      title_uz: req.body.title_uz,
      title_ru: req.body.title_ru,
      title_en: req.body.title_en,
      link: req.body.link,
    };

    // 🔹 Har bir til uchun yangi rasm yuklangan bo‘lsa:
    ["uz", "ru", "en"].forEach((lang) => {
      if (files[`image_${lang}`]) {
        // eski faylni o‘chiramiz
        deleteOldFile(banner[`image_${lang}`]);
        // yangi fayl manzilini DBga yozamiz
        updatedData[`image_${lang}`] = `/uploads/${files[`image_${lang}`][0].filename}`;
      }
    });

    // 🔹 Banner yangilanadi
    await banner.update(updatedData);

    res.json({
      message: "✅ Banner muvaffaqiyatli yangilandi",
      banner,
    });
  } catch (err) {
    console.error("❌ update xatosi:", err);
    res.status(500).json({ error: err.message });
  }
};

/* ======================================================================
   🟥 4. Banner o‘chirish  =>  DELETE /api/banners/:id
   ====================================================================== */
exports.remove = async (req, res) => {
  try {
    // 🔹 Bannerni topamiz
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ error: "Banner topilmadi" });

    // 🔹 Har bir tildagi rasm faylini o‘chiramiz
    ["uz", "ru", "en"].forEach((lang) => {
      const filePath = banner[`image_${lang}`];
      if (filePath) {
        const absPath = path.join(__dirname, "../", filePath);
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      }
    });

    // 🔹 Bazadan yozuvni o‘chiramiz
    await banner.destroy();

    res.json({ message: "🗑 Banner o‘chirildi" });
  } catch (err) {
    console.error("❌ remove xatosi:", err);
    res.status(500).json({ error: err.message });
  }
};
