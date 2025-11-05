// backend/routes/componentRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const componentController = require("../controllers/componentController");

// 3 til uchun fayl yuklash
const uploader = upload.fields([
  { name: "file_uz", maxCount: 1 },
  { name: "file_ru", maxCount: 1 },
  { name: "file_en", maxCount: 1 },
]);

router.get("/", componentController.getAll);
router.get("/:id", componentController.getById);
router.post("/", uploader, componentController.create);
router.put("/:id", uploader, componentController.updateById);
router.delete("/:id", componentController.removeById);

module.exports = router;
