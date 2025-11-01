const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const controller = require("../controllers/bannerController");

// Fayllar yuklanadigan joy
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🔹 CRUD marshrutlari
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
