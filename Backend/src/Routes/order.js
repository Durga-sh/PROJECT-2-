const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Order routes
router.post("/", authenticate, orderController.createOrder);
router.get("/customer", authenticate, orderController.getCustomerOrders);
router.get("/chef", authenticate, orderController.getChefOrders);
router.get("/chef/stats", authenticate, orderController.getChefOrderStats);
router.get("/:orderId", authenticate, orderController.getOrderById);
router.put("/:orderId/status", authenticate, orderController.updateOrderStatus);
router.put("/:orderId/cancel", authenticate, orderController.cancelOrder);
router.post("/:orderId/rating", authenticate, orderController.addRating);

module.exports = router;
