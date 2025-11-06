const { NewPage } = require("../models");

// 🔹 Barcha sahifalarni olish

exports.getAllNewPages = async (req, res) => {
  try {
    const pages = await NewPage.findAll({ order: [["id", "DESC"]] });
    res.json(pages);
  } catch (err) {
    console.error("❌ Xato:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

exports.getNewPageById = async (req, res) => {
  try {
    const page = await NewPage.findByPk(req.params.id);
    if (!page) return res.status(404).json({ message: "Sahifa topilmadi" });
    res.json(page);
  } catch (err) {
    console.error("❌ Xato:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 🔹 Yangi sahifa yaratish
exports.createNewPage = async (req, res) => {
  try {
    const item = await NewPage.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ createNewPage xato:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Yangilash
exports.updateNewPage = async (req, res) => {
  try {
    const item = await NewPage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Topilmadi" });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    console.error("❌ updateNewPage xato:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 O‘chirish
exports.deleteNewPage = async (req, res) => {
  try {
    const deleted = await NewPage.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Topilmadi" });
    res.json({ message: "✅ O‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xatosi" });
  }
};
