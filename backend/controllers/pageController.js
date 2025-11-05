const { Page, Component, Banner } = require("../models");

// ✅ Barcha sahifalar
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [
        {
          model: Component,
          as: "component",
          attributes: ["id", "title_uz", "banner_id"],
        },
      ],
      order: [["id", "DESC"]],
    });

    // banner titles qo‘shish
    const allBanners = await Banner.findAll({
      attributes: ["id", "title_uz"],
    });

    const result = pages.map((page) => ({
      ...page.toJSON(),
      banner_titles: (page.banner_ids || [])
        .map((id) => allBanners.find((b) => b.id === id)?.title_uz)
        .filter(Boolean),
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Sahifalarni olishda xato:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

// ✅ Bitta sahifa
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id, {
      include: [
        {
          model: Component,
          as: "component",
          attributes: ["id", "title_uz", "banner_id"],
        },
      ],
    });

    if (!page) return res.status(404).json({ error: "Sahifa topilmadi" });

    const allBanners = await Banner.findAll({ attributes: ["id", "title_uz"] });

    res.json({
      ...page.toJSON(),
      banner_titles: (page.banner_ids || [])
        .map((id) => allBanners.find((b) => b.id === id)?.title_uz)
        .filter(Boolean),
    });
  } catch (error) {
    console.error("❌ Sahifani olishda xato:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

// ✅ Create
exports.createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (error) {
    console.error("❌ Sahifa yaratishda xato:", error);
    res.status(500).json({ error: "Sahifa yaratishda xato" });
  }
};

// ✅ Update
exports.updatePage = async (req, res) => {
  try {
    await Page.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Sahifa yangilandi" });
  } catch (error) {
    console.error("❌ Yangilashda xato:", error);
    res.status(500).json({ error: "Yangilashda xato" });
  }
};

// ✅ Delete
exports.deletePage = async (req, res) => {
  try {
    await Page.destroy({ where: { id: req.params.id } });
    res.json({ message: "🗑 O'chirildi" });
  } catch (error) {
    console.error("❌ O'chirishda xato:", error);
    res.status(500).json({ error: "O'chirishda xato" });
  }
};
