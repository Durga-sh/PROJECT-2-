const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/Order");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createPaymentOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", orderId } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Create Razorpay order
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits of timestamp
    const orderIdShort = orderId.toString().slice(-8); // Last 8 characters of orderId
    const receipt = `ord_${orderIdShort}_${timestamp}`.slice(0, 40); // Ensure max 40 chars

    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: receipt,
      notes: {
        orderId: orderId,
        customerId: req.user.id,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Create signature string
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      // Payment is verified, update order status
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Update order with payment details
      order.paymentStatus = "completed";
      order.paymentDetails = {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      };
      order.status = "confirmed"; // Update order status to confirmed

      await order.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          orderId: order._id,
          paymentId: razorpay_payment_id,
          status: "verified",
        },
      });
    } else {
      // Payment verification failed
      const order = await Order.findById(orderId);

      if (order) {
        order.paymentStatus = "failed";
        order.status = "cancelled";
        await order.save();
      }

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Handle payment failure
const handlePaymentFailure = async (req, res) => {
  try {
    const { orderId, error } = req.body;

    const order = await Order.findById(orderId);

    if (order) {
      order.paymentStatus = "failed";
      order.status = "cancelled";
      order.paymentDetails = {
        error: error,
        failedAt: new Date(),
      };

      await order.save();
    }

    res.json({
      success: true,
      message: "Payment failure recorded",
    });
  } catch (error) {
    console.error("Handle payment failure error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to handle payment failure",
      error: error.message,
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user has permission to view this order
    if (
      order.customerId.toString() !== req.user.id &&
      req.user.role !== "chef"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        totalAmount: order.totalAmount,
        paymentDetails: order.paymentDetails,
      },
    });
  } catch (error) {
    console.error("Get payment details error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get payment details",
      error: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentDetails,
};
