// 🔹 "HomeTitle" modelini import qilamiz
// Model fayli "models/HomeTitle.js" da joylashgan bo‘lishi kerak
const { HomeTitle } = require("../models");


// ==========================
// 🟢 1. Barcha HomeTitle yozuvlarini olish
// ==========================
exports.getAll = async (req, res) => {
  try {
    // Barcha ma'lumotlarni bazadan olib kelamiz
    // "order" parametri bo‘yicha so‘nggi yozuvlar birinchi chiqadi (DESC = kamayish tartibi)
    const data = await HomeTitle.findAll({ order: [["id", "DESC"]] });

    // Natijani JSON formatda qaytaramiz
    res.json(data);
  } catch (err) {
    // Agar xatolik bo‘lsa, status 500 bilan xabarni yuboramiz
    res.status(500).json({ error: err.message });
  }
};


// ==========================
// 🟢 2. ID bo‘yicha bitta HomeTitle olish
// ==========================
exports.getById = async (req, res) => {
  try {
    // Bazadan bitta yozuvni ID bo‘yicha qidiramiz
    const data = await HomeTitle.findByPk(req.params.id);

    // Agar topilmasa — 404 (Not Found) xabar yuboramiz
    if (!data) return res.status(404).json({ error: "Topilmadi" });

    // Aks holda — yozuvni JSON formatda yuboramiz
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==========================
// 🟢 3. Yangi HomeTitle qo‘shish
// ==========================
exports.create = async (req, res) => {
  try {
    // So‘rov body (req.body) ichidagi ma'lumot asosida yangi yozuv yaratamiz
    const newTitle = await HomeTitle.create(req.body);

    // Muvaffaqiyatli yaratilsa — 201 (Created) status bilan natijani qaytaramiz
    res.status(201).json(newTitle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==========================
// 🟢 4. HomeTitle ma’lumotini yangilash
// ==========================
exports.update = async (req, res) => {
  try {
    // Avval bazadan mavjud yozuvni topamiz
    const title = await HomeTitle.findByPk(req.params.id);

    // Agar topilmasa — 404 qaytaramiz
    if (!title) return res.status(404).json({ error: "Topilmadi" });

    // Agar topilgan bo‘lsa — yangi qiymatlar bilan yangilaymiz
    await title.update(req.body);

    // Muvaffaqiyatli yangilangan yozuvni qaytaramiz
    res.json({ message: "Yangilandi", title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ==========================
// 🟢 5. HomeTitle yozuvini o‘chirish
// ==========================
exports.remove = async (req, res) => {
  try {
    // O‘chirilishi kerak bo‘lgan yozuvni bazadan topamiz
    const title = await HomeTitle.findByPk(req.params.id);

    // Agar topilmasa — 404 xatolik
    if (!title) return res.status(404).json({ error: "Topilmadi" });

    // Topilgan yozuvni o‘chiramiz
    await title.destroy();

    // Muvaffaqiyatli o‘chirilganini qaytaramiz
    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 🟢 6. So‘nggi HomeTitle yozuvini olish
// ==========================
// 🟢 Eng so‘nggi HomeTitle yozuvini olish
exports.getLatest = async (req, res) => {
  try {
    const latest = await HomeTitle.findOne({
      order: [["id", "DESC"]],
    });

    if (!latest) return res.status(404).json({ error: "Hech narsa topilmadi" });

    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
