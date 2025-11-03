const { Page, Banner } = require("../models");
const { Op } = require("sequelize");

// ✅ Barcha sahifalarni olish
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [{ model: Banner, as: "banner", attributes: ["id", "title_uz"] }],
      order: [["id", "DESC"]],
    });

    

    // Banner nomlarini olish
    const allBanners = await Banner.findAll({
      attributes: ["id", "title_uz"],
    });

    const result = pages.map((page) => {
      const bannerTitles = (page.banner_ids || [])
        .map((id) => {
          const found = allBanners.find((b) => b.id === id);
          return found ? found.title_uz : null;
        })
        .filter(Boolean);
      return { ...page.toJSON(), banner_titles: bannerTitles };
    });

    res.json(result);
  } catch (error) {
    console.error("❌ Sahifalarni olishda xato:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

// ✅ Bitta sahifani olish
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id, {
      include: [{ model: Banner, as: "banner", attributes: ["id", "title_uz"] }],
    });
    if (!page) return res.status(404).json({ error: "Sahifa topilmadi" });

    // Qo‘shimcha banner nomlarini topamiz
    const allBanners = await Banner.findAll({ attributes: ["id", "title_uz"] });
    const bannerTitles = (page.banner_ids || [])
      .map((id) => {
        const found = allBanners.find((b) => b.id === id);
        return found ? found.title_uz : null;
      })
      .filter(Boolean);

    res.json({ ...page.toJSON(), banner_titles: bannerTitles });
  } catch (error) {
    console.error("❌ Sahifani olishda xato:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

// ✅ Yangi sahifa yaratish
exports.createPage = async (req, res) => {
  try {
    let { banner_ids, ...data } = req.body;

    // String sifatida kelsa JSON parse qilamiz
    if (typeof banner_ids === "string") {
      try {
        banner_ids = JSON.parse(banner_ids);
      } catch {
        banner_ids = [];
      }
    }

    if (!Array.isArray(banner_ids)) banner_ids = [];

    const page = await Page.create({ ...data, banner_ids });
    res.status(201).json(page);
  } catch (error) {
    console.error("❌ Sahifa yaratishda xato:", error);
    res.status(500).json({ error: "Sahifa yaratishda xato" });
  }
};

// ✅ Sahifani yangilash
exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).json({ error: "Sahifa topilmadi" });

    let { banner_ids, ...data } = req.body;
    if (typeof banner_ids === "string") {
      try {
        banner_ids = JSON.parse(banner_ids);
      } catch {
        banner_ids = [];
      }
    }

    if (!Array.isArray(banner_ids)) banner_ids = [];

    await page.update({ ...data, banner_ids });
    res.json(page);
  } catch (error) {
    console.error("❌ Sahifani yangilashda xato:", error);
    res.status(500).json({ error: "Yangilashda xato" });
  }
};

// ✅ Sahifani o‘chirish
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByPk(req.params.id);
    if (!page) return res.status(404).json({ error: "Sahifa topilmadi" });

    await page.destroy();
    res.json({ message: "🗑 Sahifa o‘chirildi" });
  } catch (error) {
    console.error("❌ Sahifani o‘chirishda xato:", error);
    res.status(500).json({ error: "O‘chirishda xato" });
  }
};
