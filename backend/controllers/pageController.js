const { Page, Banner } = require("../models");

// ✅ Barcha sahifalarni olish
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.findAll({
      include: [
        {
          model: Banner,
          as: "banner",
          attributes: ["id", "title_uz"],
        },
      ],
      order: [["id", "DESC"]],
    });
    res.json(pages);
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
    res.json(page);
  } catch (error) {
    console.error("❌ Sahifani olishda xato:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};

// ✅ Yangi sahifa yaratish
exports.createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
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

    await page.update(req.body);
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


// ✅ Sahifani banner_id orqali olish
app.get("/api/pages", async (req, res) => {
  try {
    const { banner_id } = req.query;

    if (!banner_id)
      return res.status(400).json({ error: "banner_id kerak" });

    const page = await db.query(
      'SELECT * FROM "Pages" WHERE banner_id = $1',
      [banner_id]
    );

    if (page.rows.length === 0)
      return res.status(404).json({ error: "Sahifa topilmadi" });

    res.json(page.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server xatosi" });
  }
});
