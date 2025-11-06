const express = require("express");
const router = express.Router();
const { getAllNewPages, getNewPageById, createNewPage, updateNewPage, deleteNewPage } = require("../controllers/newPageController");

router.get("/", getAllNewPages);
router.get("/:id", getNewPageById);
router.post("/", createNewPage);
router.put("/:id", updateNewPage);
router.delete("/:id", deleteNewPage);

module.exports = router;
