const express = require("express");
const router = express.Router();
const submenuController = require("../controllers/submenuController");

router.post("/", submenuController.createSubmenu);
router.get("/", submenuController.getAllSubmenus);
router.get("/:id", submenuController.getSubmenuById);
router.put("/:id", submenuController.updateSubmenu);
router.delete("/:id", submenuController.deleteSubmenu);

module.exports = router;
