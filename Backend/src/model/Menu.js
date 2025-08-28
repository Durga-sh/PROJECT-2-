const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ["breakfast", "lunch", "dinner", "snacks", "desserts", "beverages"],
  },
  cuisine: {
    type: String,
    required: true,
    enum: [
      "indian",
      "chinese",
      "italian",
      "mexican",
      "continental",
      "thai",
      "other",
    ],
  },
  dietaryInfo: [
    {
      type: String,
      enum: [
        "vegetarian",
        "vegan",
        "gluten-free",
        "dairy-free",
        "keto",
        "low-carb",
      ],
    },
  ],
  ingredients: [String],
  allergens: [String],
  spiceLevel: {
    type: String,
    enum: ["mild", "medium", "spicy", "very-spicy"],
    default: "mild",
  },
  preparationTime: {
    type: Number, // in minutes
    required: true,
    min: 10,
    max: 180,
  },
  servingSize: {
    type: String,
    required: true,
    enum: ["1-person", "2-person", "4-person", "family"],
  },
  image: {
    type: String, // URL to image
    default: null,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  availableQuantity: {
    type: Number,
    default: 10,
    min: 0,
  },
});

const menuSchema = new mongoose.Schema(
  {
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        message: "Menu date cannot be in the past",
      },
    },
    items: [menuItemSchema],
    deliveryAreas: [
      {
        area: String,
        deliveryFee: {
          type: Number,
          min: 0,
          default: 0,
        },
        estimatedDeliveryTime: {
          type: Number, // in minutes
          min: 15,
          default: 60,
        },
      },
    ],
    orderDeadline: {
      type: Date,
      required: true,
    },
    pickupAvailable: {
      type: Boolean,
      default: true,
    },
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    specialInstructions: {
      type: String,
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
menuSchema.index({ chef: 1, date: 1 });
menuSchema.index({ date: 1, isActive: 1 });
menuSchema.index({ "deliveryAreas.area": 1 });
menuSchema.index({ "items.category": 1 });
menuSchema.index({ "items.cuisine": 1 });

// Middleware to ensure unique menu per chef per day
menuSchema.index({ chef: 1, date: 1 }, { unique: true });

// Virtual to get total items count
menuSchema.virtual("totalItems").get(function () {
  return this.items.length;
});

// Method to check if menu is still accepting orders
menuSchema.methods.isAcceptingOrders = function () {
  const now = new Date();
  return (
    this.isActive &&
    this.orderDeadline > now &&
    this.items.some((item) => item.isAvailable && item.availableQuantity > 0)
  );
};

// Method to get available items only
menuSchema.methods.getAvailableItems = function () {
  return this.items.filter(
    (item) => item.isAvailable && item.availableQuantity > 0
  );
};

module.exports = mongoose.model("Menu", menuSchema);
