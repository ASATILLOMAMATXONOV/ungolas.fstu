const express = require("express");
const router = express.Router();
const controller = require("../controllers/homeTitleController");

// ✅ Qo‘shimcha route: eng so‘nggi yozuvni olish (birinchi bo‘lishi kerak!)
router.get("/latest", controller.getLatest);

// CRUD routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
