"use client";

import { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import orderAPI from "../api/order";
import paymentAPI from "../api/payment";

const CartModal = ({
  isOpen,
  onClose,
  cart,
  updateCartItem,
  removeFromCart,
  clearCart,
}) => {
  const [orderType, setOrderType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [customerNotes, setCustomerNotes] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    area: "",
    city: "",
    pincode: "",
    landmark: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    const itemsTotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const deliveryFee = orderType === "delivery" ? 50 : 0; // Default delivery fee
    const tax = Math.round((itemsTotal + deliveryFee) * 0.05);
    return {
      itemsTotal,
      deliveryFee,
      tax,
      total: itemsTotal + deliveryFee + tax,
    };
  };

  const handleAddressChange = (field, value) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (
      orderType === "delivery" &&
      (!deliveryAddress.street ||
        !deliveryAddress.area ||
        !deliveryAddress.city ||
        !deliveryAddress.pincode ||
        !deliveryAddress.contactNumber)
    ) {
      alert("Please fill in all delivery address fields");
      return;
    }

    setLoading(true);
    try {
      // Calculate total amount
      const itemsTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      const deliveryFee = orderType === "delivery" ? 50 : 0;
      const tax = itemsTotal * 0.05; // 5% tax
      const totalAmount = itemsTotal + deliveryFee + tax;

      // Format items for backend (each item needs menuId and itemId)
      const orderItems = cart.map((item) => ({
        menuId: item.menuId,
        itemId: item._id,
        quantity: item.quantity,
        specialRequests: item.specialRequests || "",
      }));

      // Create order data
      const orderData = {
        items: orderItems,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : undefined,
        paymentMethod,
        totalAmount,
        deliveryFee,
        notes: customerNotes,
        orderType,
      };

      // Create order first
      const result = await orderAPI.createOrder(orderData);

      if (result.success) {
        const orderId = result.data._id;
        const orderNumber = result.data.orderNumber;

        // Handle payment based on method
        if (paymentMethod === "online") {
          // Load Razorpay script if not already loaded
          if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            await new Promise((resolve) => {
              script.onload = resolve;
            });
          }

          // Initiate Razorpay payment
          await paymentAPI.initiateRazorpayPayment(
            {
              orderId,
              orderNumber,
              totalAmount,
            },
            {
              onSuccess: (paymentData) => {
                alert("Payment successful! Order placed successfully!");
                clearCart();
                onClose();
                resetForm();
              },
              onError: (error) => {
                alert(`Payment failed: ${error}`);
                setLoading(false);
              },
              onDismiss: () => {
                alert(
                  "Payment cancelled. You can retry payment from order history."
                );
                setLoading(false);
              },
            }
          );
        } else {
          // For cash/UPI payments, order is placed successfully
          alert("Order placed successfully!");
          clearCart();
          onClose();
          resetForm();
        }
      } else {
        alert(`Order failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Place order error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      if (paymentMethod !== "online") {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setOrderType("delivery");
    setDeliveryAddress({
      street: "",
      area: "",
      city: "",
      pincode: "",
      landmark: "",
      contactNumber: "",
    });
    setPaymentMethod("online");
    setCustomerNotes("");
  };

  if (!isOpen) return null;

  const { itemsTotal, deliveryFee, tax, total } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              Your Cart ({cart.length} items)
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={`${item.menuId}-${item._id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.menuId,
                              item._id,
                              item.quantity - 1
                            )
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartItem(
                              item.menuId,
                              item._id,
                              item.quantity + 1
                            )
                          }
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.menuId, item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="delivery"
                      checked={orderType === "delivery"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="mr-2"
                    />
                    Delivery
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pickup"
                      checked={orderType === "pickup"}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="mr-2"
                    />
                    Pickup
                  </label>
                </div>
              </div>

              {/* Delivery Address */}
              {orderType === "delivery" && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Delivery Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Street Address *"
                      value={deliveryAddress.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Area *"
                      value={deliveryAddress.area}
                      onChange={(e) =>
                        handleAddressChange("area", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={deliveryAddress.pincode}
                      onChange={(e) =>
                        handleAddressChange("pincode", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Landmark"
                      value={deliveryAddress.landmark}
                      onChange={(e) =>
                        handleAddressChange("landmark", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="tel"
                      placeholder="Contact Number *"
                      value={deliveryAddress.contactNumber}
                      onChange={(e) =>
                        handleAddressChange("contactNumber", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Online Payment
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Cash on Delivery
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    UPI
                  </label>
                </div>
              </div>

              {/* Customer Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Any special instructions for the chef..."
                />
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items Total:</span>
                    <span>₹{itemsTotal}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (5%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || cart.length === 0}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : `Place Order - ₹${total}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
