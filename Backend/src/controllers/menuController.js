const Menu = require("../model/Menu");
const User = require("../model/User");

class MenuController {
  // Create or update daily menu (Chef only)
  createMenu = async (req, res) => {
    try {
      const chefId = req.user._id;
      const {
        date,
        items,
        deliveryAreas,
        orderDeadline,
        pickupAvailable,
        deliveryAvailable,
        specialInstructions,
      } = req.body;

      // Validate that user is a chef
      if (req.user.role !== "chef") {
        return res.status(403).json({
          success: false,
          message: "Only chefs can create menus",
        });
      }

      // Validate date
      const menuDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (menuDate < today) {
        return res.status(400).json({
          success: false,
          message: "Menu date cannot be in the past",
        });
      }

      // Check if menu already exists for this date
      const existingMenu = await Menu.findOne({ chef: chefId, date: menuDate });

      if (existingMenu) {
        // Update existing menu
        existingMenu.items = items;
        existingMenu.deliveryAreas = deliveryAreas;
        existingMenu.orderDeadline = new Date(orderDeadline);
        existingMenu.pickupAvailable = pickupAvailable;
        existingMenu.deliveryAvailable = deliveryAvailable;
        existingMenu.specialInstructions = specialInstructions;

        await existingMenu.save();

        return res.status(200).json({
          success: true,
          message: "Menu updated successfully",
          menu: existingMenu,
        });
      }

      // Create new menu
      const menu = new Menu({
        chef: chefId,
        date: menuDate,
        items,
        deliveryAreas,
        orderDeadline: new Date(orderDeadline),
        pickupAvailable,
        deliveryAvailable,
        specialInstructions,
      });

      await menu.save();

      res.status(201).json({
        success: true,
        message: "Menu created successfully",
        menu,
      });
    } catch (error) {
      console.error("Create menu error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create menu",
      });
    }
  };

  // Get chef's menus
  getChefMenus = async (req, res) => {
    try {
      const chefId = req.user._id;
      const { page = 1, limit = 10, date, status } = req.query;

      const query = { chef: chefId };

      if (date) {
        const searchDate = new Date(date);
        query.date = {
          $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
          $lt: new Date(searchDate.setHours(23, 59, 59, 999)),
        };
      }

      if (status) {
        query.isActive = status === "active";
      }

      const menus = await Menu.find(query)
        .sort({ date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate("chef", "name email");

      const total = await Menu.countDocuments(query);

      res.status(200).json({
        success: true,
        menus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get chef menus error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch menus",
      });
    }
  };

  // Get available menus for customers (with filters)
  getAvailableMenus = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        area,
        cuisine,
        category,
        dietaryInfo,
        maxPrice,
        date,
      } = req.query;

      // Build query
      const query = {
        isActive: true,
        orderDeadline: { $gt: new Date() },
      };

      // Date filter (default to today)
      const searchDate = date ? new Date(date) : new Date();
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999)),
      };

      // Area filter
      if (area) {
        query["deliveryAreas.area"] = { $regex: area, $options: "i" };
      }

      // Build aggregation pipeline
      const pipeline = [
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "chef",
            foreignField: "_id",
            as: "chefDetails",
          },
        },
        {
          $unwind: "$chefDetails",
        },
      ];

      // Add item filters
      if (cuisine || category || dietaryInfo || maxPrice) {
        const itemFilters = {};

        if (cuisine) itemFilters["items.cuisine"] = cuisine;
        if (category) itemFilters["items.category"] = category;
        if (dietaryInfo)
          itemFilters["items.dietaryInfo"] = { $in: [dietaryInfo] };
        if (maxPrice)
          itemFilters["items.price"] = { $lte: parseFloat(maxPrice) };

        pipeline.push({
          $match: itemFilters,
        });
      }

      // Add pagination
      pipeline.push({ $skip: (page - 1) * limit }, { $limit: parseInt(limit) });

      // Project fields
      pipeline.push({
        $project: {
          date: 1,
          items: 1,
          deliveryAreas: 1,
          orderDeadline: 1,
          pickupAvailable: 1,
          deliveryAvailable: 1,
          specialInstructions: 1,
          "chefDetails.name": 1,
          "chefDetails._id": 1,
          createdAt: 1,
        },
      });

      const menus = await Menu.aggregate(pipeline);
      const total = await Menu.countDocuments(query);

      res.status(200).json({
        success: true,
        menus,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get available menus error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch available menus",
      });
    }
  };

  // Get single menu by ID
  getMenuById = async (req, res) => {
    try {
      const { menuId } = req.params;

      const menu = await Menu.findById(menuId).populate(
        "chef",
        "name email createdAt"
      );

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found",
        });
      }

      res.status(200).json({
        success: true,
        menu,
      });
    } catch (error) {
      console.error("Get menu by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch menu",
      });
    }
  };

  // Update menu item availability
  updateItemAvailability = async (req, res) => {
    try {
      const { menuId, itemId } = req.params;
      const { isAvailable, availableQuantity } = req.body;

      const menu = await Menu.findOne({
        _id: menuId,
        chef: req.user._id,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found or access denied",
        });
      }

      const item = menu.items.id(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      if (isAvailable !== undefined) item.isAvailable = isAvailable;
      if (availableQuantity !== undefined)
        item.availableQuantity = availableQuantity;

      await menu.save();

      res.status(200).json({
        success: true,
        message: "Item availability updated successfully",
        item,
      });
    } catch (error) {
      console.error("Update item availability error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update item availability",
      });
    }
  };

  // Delete menu
  deleteMenu = async (req, res) => {
    try {
      const { menuId } = req.params;

      const menu = await Menu.findOneAndDelete({
        _id: menuId,
        chef: req.user._id,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found or access denied",
        });
      }

      res.status(200).json({
        success: true,
        message: "Menu deleted successfully",
      });
    } catch (error) {
      console.error("Delete menu error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete menu",
      });
    }
  };

  toggleMenuStatus = async (req, res) => {
    try {
      const { menuId } = req.params;

      const menu = await Menu.findOne({
        _id: menuId,
        chef: req.user._id,
      });

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu not found or access denied",
        });
      }

      menu.isActive = !menu.isActive;
      await menu.save();

      res.status(200).json({
        success: true,
        message: `Menu ${
          menu.isActive ? "activated" : "deactivated"
        } successfully`,
        menu,
      });
    } catch (error) {
      console.error("Toggle menu status error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to toggle menu status",
      });
    }
  };
}

module.exports = new MenuController();
