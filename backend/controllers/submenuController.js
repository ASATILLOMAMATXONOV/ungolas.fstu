const { Submenu, Menu } = require("../models");

// ➕ Yangi submenu yaratish
exports.createSubmenu = async (req, res) => {
  try {
    const submenu = await Submenu.create(req.body);
    res.status(201).json(submenu.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📄 Barcha submenyularni olish
exports.getAllSubmenus = async (req, res) => {
  try {
    const submenus = await Submenu.findAll({
      attributes: [
        "id",
        "menu_id",
        "title_uz",
        "title_ru",
        "title_en",
        "has_content",
      ],
      include: [{ model: Menu, as: "menu", attributes: ["id", "title_uz"] }],
      order: [["id", "ASC"]],
    });
    res.json(submenus.map((s) => s.toJSON()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 ID bo‘yicha submenu olish
exports.getSubmenuById = async (req, res) => {
  try {
    const submenu = await Submenu.findByPk(req.params.id, {
      attributes: [
        "id",
        "menu_id",
        "title_uz",
        "title_ru",
        "title_en",
        "content_uz",
        "content_ru",
        "content_en",
        "has_content",
      ],
      include: [{ model: Menu, as: "menu", attributes: ["id", "title_uz"] }],
    });

    if (!submenu) {
      return res.status(404).json({ error: "Submenu topilmadi" });
    }

    // 🔹 toza JSON qaytaramiz
    res.json(submenu.toJSON());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Tahrirlash
exports.updateSubmenu = async (req, res) => {
  try {
    const submenu = await Submenu.findByPk(req.params.id);
    if (!submenu) {
      return res.status(404).json({ error: "Submenu topilmadi" });
    }

    await submenu.update(req.body);
    res.json({
      message: "✅ Submenu yangilandi",
      submenu: submenu.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ O‘chirish
exports.deleteSubmenu = async (req, res) => {
  try {
    const submenu = await Submenu.findByPk(req.params.id);
    if (!submenu) {
      return res.status(404).json({ error: "Topilmadi" });
    }

    await submenu.destroy();
    res.json({ message: "🗑️ Submenu o‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
