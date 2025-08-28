import React, { useState } from "react";
import { Plus, X, Clock, DollarSign, Users } from "lucide-react";
import menuAPI from "../api/menu";

const CreateMenuModal = ({ isOpen, onClose, onMenuCreated }) => {
  const [formData, setFormData] = useState({
    date: "",
    orderDeadline: "",
    pickupAvailable: true,
    deliveryAvailable: true,
    specialInstructions: "",
    deliveryAreas: [{ area: "", deliveryFee: 0, estimatedDeliveryTime: 60 }],
    items: [],
  });

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "lunch",
    cuisine: "indian",
    dietaryInfo: [],
    ingredients: "",
    allergens: "",
    spiceLevel: "mild",
    preparationTime: 30,
    servingSize: "1-person",
    availableQuantity: 10,
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "breakfast",
    "lunch",
    "dinner",
    "snacks",
    "desserts",
    "beverages",
  ];
  const cuisines = [
    "indian",
    "chinese",
    "italian",
    "mexican",
    "continental",
    "thai",
    "other",
  ];
  const dietaryOptions = [
    "vegetarian",
    "vegan",
    "gluten-free",
    "dairy-free",
    "keto",
    "low-carb",
  ];
  const spiceLevels = ["mild", "medium", "spicy", "very-spicy"];
  const servingSizes = ["1-person", "2-person", "4-person", "family"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "dietaryInfo") {
      setNewItem((prev) => ({
        ...prev,
        dietaryInfo: checked
          ? [...prev.dietaryInfo, value]
          : prev.dietaryInfo.filter((item) => item !== value),
      }));
    } else {
      setNewItem((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addItem = () => {
    if (!newItem.name || !newItem.description || !newItem.price) {
      alert("Please fill in all required fields for the menu item");
      return;
    }

    const item = {
      ...newItem,
      price: parseFloat(newItem.price),
      preparationTime: parseInt(newItem.preparationTime),
      availableQuantity: parseInt(newItem.availableQuantity),
      ingredients: newItem.ingredients
        .split(",")
        .map((ing) => ing.trim())
        .filter((ing) => ing),
      allergens: newItem.allergens
        .split(",")
        .map((all) => all.trim())
        .filter((all) => all),
      isAvailable: true,
    };

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, item],
    }));

    // Reset new item form
    setNewItem({
      name: "",
      description: "",
      price: "",
      category: "lunch",
      cuisine: "indian",
      dietaryInfo: [],
      ingredients: "",
      allergens: "",
      spiceLevel: "mild",
      preparationTime: 30,
      servingSize: "1-person",
      availableQuantity: 10,
    });
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const addDeliveryArea = () => {
    setFormData((prev) => ({
      ...prev,
      deliveryAreas: [
        ...prev.deliveryAreas,
        { area: "", deliveryFee: 0, estimatedDeliveryTime: 60 },
      ],
    }));
  };

  const updateDeliveryArea = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      deliveryAreas: prev.deliveryAreas.map((area, i) =>
        i === index
          ? { ...area, [field]: field === "area" ? value : parseFloat(value) }
          : area
      ),
    }));
  };

  const removeDeliveryArea = (index) => {
    if (formData.deliveryAreas.length > 1) {
      setFormData((prev) => ({
        ...prev,
        deliveryAreas: prev.deliveryAreas.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.orderDeadline ||
      formData.items.length === 0
    ) {
      alert(
        "Please fill in all required fields and add at least one menu item"
      );
      return;
    }

    setLoading(true);
    try {
      const result = await menuAPI.createMenu(formData);
      if (result.success) {
        alert("Menu created successfully!");
        onMenuCreated(result.menu);
        onClose();
        // Reset form
        setFormData({
          date: "",
          orderDeadline: "",
          pickupAvailable: true,
          deliveryAvailable: true,
          specialInstructions: "",
          deliveryAreas: [
            { area: "", deliveryFee: 0, estimatedDeliveryTime: 60 },
          ],
          items: [],
        });
      } else {
        alert(result.message || "Failed to create menu");
      }
    } catch (error) {
      console.error("Create menu error:", error);
      alert("Failed to create menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Menu
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Menu Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Deadline *
              </label>
              <input
                type="datetime-local"
                name="orderDeadline"
                value={formData.orderDeadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>

          {/* Availability Options */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Availability
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="pickupAvailable"
                  checked={formData.pickupAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Pickup Available
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="deliveryAvailable"
                  checked={formData.deliveryAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Delivery Available
              </label>
            </div>
          </div>

          {/* Delivery Areas */}
          {formData.deliveryAvailable && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Delivery Areas
                </label>
                <button
                  type="button"
                  onClick={addDeliveryArea}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  + Add Area
                </button>
              </div>
              {formData.deliveryAreas.map((area, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2"
                >
                  <input
                    type="text"
                    placeholder="Area name"
                    value={area.area}
                    onChange={(e) =>
                      updateDeliveryArea(index, "area", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Delivery fee"
                    value={area.deliveryFee}
                    onChange={(e) =>
                      updateDeliveryArea(index, "deliveryFee", e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    placeholder="Delivery time (min)"
                    value={area.estimatedDeliveryTime}
                    onChange={(e) =>
                      updateDeliveryArea(
                        index,
                        "estimatedDeliveryTime",
                        e.target.value
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formData.deliveryAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliveryArea(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Any special instructions for customers..."
            />
          </div>

          {/* Menu Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Menu Items
            </h3>

            {/* Add New Item Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-3">Add New Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Item name *"
                  value={newItem.name}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price *"
                  value={newItem.price}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <textarea
                name="description"
                placeholder="Description *"
                value={newItem.description}
                onChange={handleItemChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  name="cuisine"
                  value={newItem.cuisine}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  name="spiceLevel"
                  value={newItem.spiceLevel}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {spiceLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    name="preparationTime"
                    value={newItem.preparationTime}
                    onChange={handleItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <select
                  name="servingSize"
                  value={newItem.servingSize}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {servingSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={newItem.availableQuantity}
                    onChange={handleItemChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  name="ingredients"
                  placeholder="Ingredients (comma separated)"
                  value={newItem.ingredients}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <input
                  type="text"
                  name="allergens"
                  placeholder="Allergens (comma separated)"
                  value={newItem.allergens}
                  onChange={handleItemChange}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                  Dietary Information
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        name="dietaryInfo"
                        value={option}
                        checked={newItem.dietaryInfo.includes(option)}
                        onChange={handleItemChange}
                        className="mr-1"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                <Plus size={16} className="mr-1" />
                Add Item
              </button>
            </div>

            {/* Display Added Items */}
            {formData.items.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Added Items ({formData.items.length})
                </h4>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white border rounded-md"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-green-600 font-semibold">
                            ₹{item.price}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {item.preparationTime}min
                          </span>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Users size={14} className="mr-1" />
                            {item.availableQuantity} available
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Menu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMenuModal;
