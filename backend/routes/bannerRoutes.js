const express = require("express");
const multer = require("multer");
const path = require("path");
const controller = require("../controllers/bannerController");

const router = express.Router();

// 🔹 Upload sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 🔹 CRUD yo‘llar
router.get("/", controller.getAll);

router.post(
  "/",
  upload.fields([
    { name: "image_uz", maxCount: 1 },
    { name: "image_ru", maxCount: 1 },
    { name: "image_en", maxCount: 1 },
  ]),
  controller.create
);

router.put(
  "/:id",
  upload.fields([
    { name: "image_uz", maxCount: 1 },
    { name: "image_ru", maxCount: 1 },
    { name: "image_en", maxCount: 1 },
  ]),
  controller.update
);

router.delete("/:id", controller.remove);

module.exports = router;
