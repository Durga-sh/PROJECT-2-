// Backend/src/Routes/menu.js
const express = require("express");
const menuController = require("../controllers/menuController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Menu routes
router.post("/", authenticate, menuController.createMenu);
router.get("/chef/my-menus", authenticate, menuController.getChefMenus);
router.get("/available", menuController.getAvailableMenus);
router.get("/:menuId", menuController.getMenuById);
router.put(
  "/:menuId/items/:itemId/availability",
  authenticate,
  menuController.updateItemAvailability
);
router.delete("/:menuId", authenticate, menuController.deleteMenu);
router.patch(
  "/:menuId/toggle-status",
  authenticate,
  menuController.toggleMenuStatus
);

module.exports = router;
