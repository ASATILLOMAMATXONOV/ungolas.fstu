// 🧩 Modelni import qilamiz (Sequelize modeli)
const { Menu } = require("../models");

/* ---------------------------------------------------------------------- */
/* 🟢 CREATE — Yangi menyu yaratish (POST /api/menus) */
/* ---------------------------------------------------------------------- */
exports.createMenu = async (req, res) => {
  try {
    // Frontenddan kelgan ma’lumotlarni ajratib olamiz
    const { title_uz, title_ru, title_en, content_uz, content_ru, content_en, has_content } = req.body;

    // 🧱 Yangi menyu obyektini bazaga yozamiz
    const newMenu = await Menu.create({
      title_uz,
      title_ru,
      title_en,
      // Agar kontent mavjud bo‘lmasa, null saqlaymiz
      content_uz: has_content ? content_uz : null,
      content_ru: has_content ? content_ru : null,
      content_en: has_content ? content_en : null,
      has_content,
    });

    // ✅ Muvaffaqiyatli yaratilganini qaytaramiz
    res.status(201).json({ message: "✅ Menu saqlandi", data: newMenu });
  } catch (error) {
    // ❌ Xatolikni ushlab olamiz
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

/* ---------------------------------------------------------------------- */
/* 🔵 GET ALL — Barcha menyularni olish (GET /api/menus) */
/* ---------------------------------------------------------------------- */
exports.getAllMenus = async (req, res) => {
  try {
    // 📥 Bazadan barcha menyularni olish
    const menus = await Menu.findAll();
    // 📤 JSON formatda yuborish
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: "Xatolik yuz berdi", error: error.message });
  }
};

/* ---------------------------------------------------------------------- */
/* 🔴 DELETE — Menyuni o‘chirish (DELETE /api/menus/:id) */
/* ---------------------------------------------------------------------- */
exports.deleteMenu = async (req, res) => {
  try {
    // URL’dan ID ni olamiz
    const { id } = req.params;

    // Bazadan menyuni topamiz
    const menu = await Menu.findByPk(id);
    if (!menu) return res.status(404).json({ message: "Menu topilmadi" });

    // 🗑 O‘chirish amali
    await menu.destroy();

    // ✅ Javob qaytaramiz
    res.json({ message: "🗑 Menu o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

/* ---------------------------------------------------------------------- */
/* 🟣 GET by ID — Bitta menyuni olish (GET /api/menus/:id) */
/* ---------------------------------------------------------------------- */
exports.getMenuById = async (req, res) => {
  try {
    // So‘rovdan id ni olamiz
    const menu = await Menu.findByPk(req.params.id);

    // Agar topilmasa
    if (!menu) return res.status(404).json({ message: "Menu topilmadi" });

    // Topilgan menyuni qaytaramiz
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------------------------------------------------------------------- */
/* 🟠 UPDATE — Menyuni yangilash (PUT /api/menus/:id) */
/* ---------------------------------------------------------------------- */
exports.updateMenu = async (req, res) => {
  try {
    // 🔍 ID orqali menyuni topamiz
    const menu = await Menu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ message: "Menu topilmadi" });

    // 📝 Ma’lumotlarni yangilaymiz
    await menu.update(req.body);

    // ✅ Javob qaytaramiz
    res.json({ message: "✅ Yangilandi", data: menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
