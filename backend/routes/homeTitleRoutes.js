const express = require("express");
const router = express.Router();
const controller = require("../controllers/homeTitleController");

// CRUD routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

// ✅ Qo‘shimcha route: eng so‘nggi yozuvni olish
router.get("/latest", async (req, res) => {
  try {
    const { HomeTitle } = require("../models");
    const latest = await HomeTitle.findOne({
      order: [["id", "DESC"]],
    });
    if (!latest) return res.status(404).json({ error: "Topilmadi" });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
