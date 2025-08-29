const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentDetails,
} = require("../controllers/paymentController");

// Create Razorpay order
router.post("/create-order", authenticateToken, createPaymentOrder);

// Verify payment
router.post("/verify", authenticateToken, verifyPayment);

// Handle payment failure
router.post("/failure", authenticateToken, handlePaymentFailure);

// Get payment details
router.get("/:orderId", authenticateToken, getPaymentDetails);

module.exports = router;
