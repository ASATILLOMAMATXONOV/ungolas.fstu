// backend/controllers/componentController.js
const fs = require("fs");
const path = require("path");
const db = require("../models");
const { Component, Banner } = db;

// 🔹 Barcha komponentlarni olish
exports.getAll = async (req, res) => {
  try {
    const components = await Component.findAll({
      order: [["id", "DESC"]],
      include: [{ model: Banner, as: "banner" }],
    });
    res.json(components);
  } catch (err) {
    console.error("❌ getAll error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 🔹 Bitta komponentni olish
exports.getById = async (req, res) => {
  try {
    const component = await Component.findByPk(req.params.id, {
      include: [{ model: Banner, as: "banner" }],
    });
    if (!component) return res.status(404).json({ message: "Topilmadi" });
    res.json(component);
  } catch (err) {
    console.error("❌ getById error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 🔹 Yangi komponent yaratish
exports.create = async (req, res) => {
  try {
    const {
      banner_id,
      title_uz,
      title_ru,
      title_en,
      content_uz,
      content_ru,
      content_en,
    } = req.body;

    const files = req.files || {};
    const image_uz = files.file_uz ? `/uploads/${files.file_uz[0].filename}` : "";
    const image_ru = files.file_ru ? `/uploads/${files.file_ru[0].filename}` : "";
    const image_en = files.file_en ? `/uploads/${files.file_en[0].filename}` : "";

    const newComponent = await Component.create({
      banner_id: banner_id || null,
      title_uz,
      title_ru,
      title_en,
      content_uz,
      content_ru,
      content_en,
      image_uz,
      image_ru,
      image_en,
    });

    res.json({ success: true, id: newComponent.id });
  } catch (err) {
    console.error("❌ create error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 🔹 Yangilash
exports.updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const component = await Component.findByPk(id);
    if (!component) return res.status(404).json({ message: "Topilmadi" });

    const {
      banner_id,
      title_uz,
      title_ru,
      title_en,
      content_uz,
      content_ru,
      content_en,
    } = req.body;

    const files = req.files || {};

    // Faylni yangilash
    const handleFile = (lang) => {
      const key = `file_${lang}`;
      if (files[key]) {
        const newPath = `/uploads/${files[key][0].filename}`;
        // eski faylni o‘chirish
        if (component[`image_${lang}`]) {
          const oldPath = path.join(__dirname, "..", component[`image_${lang}`]);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        return newPath;
      }
      return component[`image_${lang}`];
    };

    await component.update({
      banner_id: banner_id || null,
      title_uz,
      title_ru,
      title_en,
      content_uz,
      content_ru,
      content_en,
      image_uz: handleFile("uz"),
      image_ru: handleFile("ru"),
      image_en: handleFile("en"),
    });

    res.json({ success: true, message: "Yangilandi" });
  } catch (err) {
    console.error("❌ updateById error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};

// 🔹 O‘chirish
exports.removeById = async (req, res) => {
  try {
    const id = req.params.id;
    const component = await Component.findByPk(id);
    if (!component) return res.status(404).json({ message: "Topilmadi" });

    ["image_uz", "image_ru", "image_en"].forEach((key) => {
      if (component[key]) {
        const filePath = path.join(__dirname, "..", component[key]);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    });

    await component.destroy();
    res.json({ success: true, message: "O‘chirildi" });
  } catch (err) {
    console.error("❌ removeById error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
};
