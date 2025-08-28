const Order = require("../model/Order");
const Menu = require("../model/Menu");
const User = require("../model/User");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      items,
      deliveryAddress,
      paymentMethod,
      totalAmount,
      deliveryFee,
      notes,
      orderType = "delivery",
    } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    // Validate all menu items exist and calculate total
    let calculatedTotal = 0;
    const orderItems = [];
    let chefId = null;
    let menuId = null;

    for (const item of items) {
      const menu = await Menu.findById(item.menuId);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: `Menu not found: ${item.menuId}`,
        });
      }

      if (!menu.isActive) {
        return res.status(400).json({
          success: false,
          message: `Menu is not available`,
        });
      }

      // Check if order deadline has passed
      if (new Date() > menu.orderDeadline) {
        return res.status(400).json({
          success: false,
          message: `Order deadline has passed for this menu`,
        });
      }

      // For now, assume all items are from the same menu (single chef)
      if (!chefId) {
        chefId = menu.chef;
        menuId = menu._id;
      } else if (chefId.toString() !== menu.chef.toString()) {
        return res.status(400).json({
          success: false,
          message: "All items must be from the same chef",
        });
      }

      // Find the specific item within the menu's items array
      const menuItem = menu.items.id(item.itemId);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found in menu`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item "${menuItem.name}" is not available`,
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      calculatedTotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialRequests: item.specialRequests || "",
      });
    }

    // Calculate tax on items total only (5%)
    const itemsTotal = calculatedTotal;
    const tax = itemsTotal * 0.05;

    // Add delivery fee and tax
    calculatedTotal += (deliveryFee || 0) + tax;

    // Validate total amount
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Total amount mismatch",
      });
    }

    // Generate unique order number
    const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create order
    const order = new Order({
      orderNumber,
      customer: customerId,
      chef: chefId,
      menu: menuId,
      items: orderItems,
      itemsTotal,
      deliveryFee: deliveryFee || 0,
      tax,
      totalAmount,
      orderType,
      deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
      paymentMethod,
      customerNotes: notes,
      status: "pending",
    });

    await order.save();

    // Populate customer and chef details
    await order.populate("customer", "name email phone");
    await order.populate("chef", "name email phone");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get customer's orders
const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { customer: customerId };
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("chef", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get customer orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get chef's orders
const getChefOrders = async (req, res) => {
  try {
    const chefId = req.user.id;
    const { page = 1, limit = 10, status, date } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { chef: chefId };
    if (status) {
      filter.status = status;
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.createdAt = { $gte: startDate, $lt: endDate };
    }

    const orders = await Order.find(filter)
      .populate("customer", "name email phone")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get chef orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Other functions (simplified for space)
const getOrderById = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Get order by ID - not implemented yet",
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const chefId = req.user.id;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if chef owns this order
    if (order.chef.toString() !== chefId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    // Update status
    order.status = status;
    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    res.json({ success: true, message: "Cancel order - not implemented yet" });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: "Failed to cancel order" });
  }
};

const addRating = async (req, res) => {
  try {
    res.json({ success: true, message: "Add rating - not implemented yet" });
  } catch (error) {
    console.error("Add rating error:", error);
    res.status(500).json({ success: false, message: "Failed to add rating" });
  }
};

const getChefOrderStats = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        averageRating: 0,
      },
    });
  } catch (error) {
    console.error("Get chef order stats error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch order statistics" });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getChefOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  addRating,
  getChefOrderStats,
};
