const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// 📁 uploads papkaga saqlanadi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🖼 TinyMCE uchun upload
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File not found" });

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ location: fileUrl }); // TinyMCE "location" ni kutadi
});

module.exports = router;
