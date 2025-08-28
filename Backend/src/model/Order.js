const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  specialRequests: {
    type: String,
    maxlength: 200,
  },
});

const deliveryAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      required: true,
    },
    items: [orderItemSchema],

    // Order totals
    itemsTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order type
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },

    // Delivery details (if applicable)
    deliveryAddress: deliveryAddressSchema,
    estimatedDeliveryTime: Date,

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online", "upi"],
      required: true,
    },
    paymentId: String, // For online payments

    // Special instructions
    customerNotes: {
      type: String,
      maxlength: 300,
    },
    chefNotes: {
      type: String,
      maxlength: 300,
    },

    // Timestamps for status changes
    confirmedAt: Date,
    preparingAt: Date,
    readyAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,

    // Ratings and feedback
    customerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    customerFeedback: {
      type: String,
      maxlength: 500,
    },
    chefRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    chefFeedback: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ chef: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;

  switch (newStatus) {
    case "confirmed":
      this.confirmedAt = new Date();
      break;
    case "preparing":
      this.preparingAt = new Date();
      break;
    case "ready":
      this.readyAt = new Date();
      break;
    case "delivered":
      this.deliveredAt = new Date();
      break;
    case "cancelled":
      this.cancelledAt = new Date();
      break;
  }

  return this.save();
};

// Method to calculate estimated delivery time
orderSchema.methods.calculateEstimatedDeliveryTime = function (
  preparationTime,
  deliveryTime = 30
) {
  const now = new Date();
  const estimatedTime = new Date(
    now.getTime() + (preparationTime + deliveryTime) * 60000
  );
  this.estimatedDeliveryTime = estimatedTime;
  return estimatedTime;
};

// Virtual for order summary
orderSchema.virtual("summary").get(function () {
  return {
    orderNumber: this.orderNumber,
    totalItems: this.items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: this.totalAmount,
    status: this.status,
    orderType: this.orderType,
  };
});

// Method to check if order can be cancelled
orderSchema.methods.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.status);
};

module.exports = mongoose.model("Order", orderSchema);
