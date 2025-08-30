"use client";

import { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Clock,
  Search,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
  ShoppingCart,
  MapPin,
  ChefHat,
  Sparkles,
  TrendingUp,
  Package,
} from "lucide-react";
import CartModal from "../components/CartModal";
import Footer from "../components/Footer";
import authAPI from "../api/auth";
import menuAPI from "../api/menu";
import orderAPI from "../api/order";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeTab, setActiveTab] = useState("menus");
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigateTo = (path) => {
    if (typeof window !== "undefined") window.location.href = path;
  };

  // All Food Categories filter chips
  const allCategories = [
    { key: "", label: "All" },
    { key: "indian", label: "Indian" },
    { key: "chinese", label: "Chinese" },
    { key: "italian", label: "Italian" },
    { key: "mexican", label: "Mexican" },
    { key: "thai", label: "Thai" },
    { key: "biryani", label: "Biryani" },
    { key: "pizza", label: "Pizza" },
    { key: "burger", label: "Burgers" },
    { key: "dessert", label: "Desserts" },
    { key: "drink", label: "Drinks" },
    { key: "salad", label: "Salads" },
    { key: "seafood", label: "Seafood" },
    { key: "vegan", label: "Vegan" },
  ];

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await authAPI.getCurrentUser();
        if (result.success) {
          if (result.user.role === "chef") {
            navigateTo("/chef-dashboard");
            return;
          }
          setUser(result.user);
          setIsAuthenticated(true);
          loadUserData();
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log("User not authenticated:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        loadAvailableMenus();
      }
    };
    checkAuthStatus();
  }, []);

  const loadAvailableMenus = async () => {
    try {
      const result = await menuAPI.getAvailableMenus(1, 20);
      if (result.success) {
        setMenus(result.menus || []);
      }
    } catch (error) {
      console.error("Error loading menus:", error);
    }
  };

  const loadUserData = async () => {
    try {
      const ordersResult = await orderAPI.getCustomerOrders(1, 10);
      if (ordersResult.success) {
        setOrders(ordersResult.data?.orders || []);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const refreshOrders = async () => {
    await loadUserData();
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
      setCart([]);
      setOrders([]);
      navigateTo("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addToCart = (menuId, item) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigateTo("/login");
      return;
    }
    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => cartItem.menuId === menuId && cartItem._id === item._id
      );
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.menuId === menuId && cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, menuId, quantity: 1 }];
    });
  };

  const updateCartItem = (menuId, itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(menuId, itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.menuId === menuId && item._id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (menuId, itemId) => {
    setCart((prev) =>
      prev.filter((item) => !(item.menuId === menuId && item._id === itemId))
    );
  };

  const clearCart = () => setCart([]);

  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);


  const getStatusColorEnhanced = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse";
      case "confirmed":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "preparing":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse";
      case "ready":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-bounce";
      case "out-for-delivery":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse";
      case "delivered":
        return "bg-gradient-to-r from-green-600 to-green-700 text-white";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "⏳ ";
      case "confirmed":
        return "✅ ";
      case "preparing":
        return "👨‍🍳 ";
      case "ready":
        return "🔔 ";
      case "out-for-delivery":
        return "🚚 ";
      case "delivered":
        return "✨ ";
      case "cancelled":
        return "❌ ";
      default:
        return "📦 ";
    }
  };

  const filteredMenus = menus.filter((menu) => {
    const matchesSearch =
      searchTerm === "" ||
      menu.items?.some(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCuisine =
      selectedCuisine === "" ||
      menu.items?.some(
        (item) =>
          (item.cuisine || "").toLowerCase() === selectedCuisine.toLowerCase()
      );

    const matchesCategory =
      selectedCategory === "" ||
      menu.items?.some((item) => {
        const cat = (item.category || "").toLowerCase();
        const cui = (item.cuisine || "").toLowerCase();
        const name = (item.name || "").toLowerCase();
        const key = selectedCategory.toLowerCase();
        return cat === key || cui === key || name.includes(key);
      });

    return matchesSearch && matchesCuisine && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-orange-400 animate-spin [animation-delay:150ms]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FoodApp</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {isAuthenticated && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-orange-700 transition-all duration-200 hover:bg-orange-50 rounded-lg group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium hidden sm:block">
                    Cart
                  </span>
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-2 border border-gray-200">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-gray-800">
                        {user?.name}
                      </span>
                      <span className="block text-xs text-green-600 font-medium">
                        User
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition-all duration-200 hover:bg-red-50 rounded-lg px-2 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/login"
                    className="flex items-center gap-1 px-4 py-2 text-orange-700 hover:text-orange-800 transition-all duration-200 hover:bg-orange-50 rounded-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </a>
                  <a
                    href="/register"
                    className="flex items-center gap-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Up</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs for authenticated users */}
      {isAuthenticated && (
        <div className="bg-white border-b border-gray-100">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("menus")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === "menus"
                    ? "border-orange-600 text-orange-700 transform scale-105"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Browse Menus
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === "orders"
                    ? "border-orange-600 text-orange-700 transform scale-105"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                My Orders
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isAuthenticated ? (
          <div className="animate-in fade-in duration-300">
            {/* Welcome Section for non-authenticated users */}
            <div className="rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden shadow-xl bg-orange-600">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                  Welcome to FoodApp!
                </h2>
                <p className="text-orange-100 mb-6 text-lg">
                  Discover delicious meals from talented local chefs. Join us
                  today to start your culinary journey!
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/register"
                    className="px-8 py-3 bg-white text-orange-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow"
                  >
                    Get Started
                  </a>
                  <a
                    href="/login"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </div>

            {/* Category chips for guests */}
            <section className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Browse by Category
                </h3>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allCategories.map((c) => (
                  <button
                    key={c.key || "all"}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors duration-200 ${
                      selectedCategory === c.key
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Sample menus for guests */}
            <div className="bg-white rounded-2xl shadow p-6 sm:p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Featured Menus Today
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenus.slice(0, 6).map((menu, index) => (
                  <div
                    key={menu._id}
                    className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/80"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <ChefHat className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {new Date(menu.date).toLocaleDateString()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {menu.items?.length} dishes available
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      {menu.items?.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm bg-white/40 rounded-lg p-2"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.name}
                          </span>
                          <span className="text-orange-600 font-bold">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                      {menu.items?.length > 2 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{menu.items.length - 2} more dishes
                        </p>
                      )}
                    </div>
                    <a
                      href="/login"
                      className="w-full inline-block py-3 px-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                    >
                      Login to Order
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === "menus" ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search + Cuisine + Categories */}
            <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-600 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search for dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-200 bg-white"
                  />
                </div>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all duration-200 bg-white min-w-[200px]"
                >
                  <option value="">All Cuisines</option>
                  <option value="indian">Indian</option>
                  <option value="chinese">Chinese</option>
                  <option value="italian">Italian</option>
                  <option value="mexican">Mexican</option>
                  <option value="continental">Continental</option>
                  <option value="thai">Thai</option>
                </select>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-semibold text-gray-900">
                    All Food Categories
                  </h3>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allCategories.map((c) => (
                    <button
                      key={c.key || "all"}
                      onClick={() => setSelectedCategory(c.key)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors duration-200 ${
                        selectedCategory === c.key
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menus list */}
            <div className="space-y-8">
              {filteredMenus.length > 0 ? (
                filteredMenus.map((menu, menuIndex) => (
                  <div
                    key={menu._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300"
                    style={{ animationDelay: `${menuIndex * 100}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 space-y-4 sm:space-y-0">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 bg-orange-600 bg-clip-text text-transparent">
                          Chef&apos;s Menu -{" "}
                          {new Date(menu.date).toLocaleDateString()}
                        </h3>
                        <p className="text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                          Order deadline:{" "}
                          {new Date(menu.orderDeadline).toLocaleString()}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {menu.deliveryAvailable && (
                            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                              🚚 Delivery Available
                            </span>
                          )}
                          {menu.pickupAvailable && (
                            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                              🏪 Pickup Available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {menu.items
                        ?.filter(
                          (item) =>
                            item.isAvailable && item.availableQuantity > 0
                        )
                        .map((item, itemIndex) => (
                          <div
                            key={item._id}
                            className="group bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/80"
                            style={{ animationDelay: `${itemIndex * 50}ms` }}
                          >
                            <div className="mb-4">
                              <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-700 transition-colors duration-200">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xl font-bold bg-orange-600 bg-clip-text text-transparent">
                                  ₹{item.price}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {item.availableQuantity} left
                                </span>
                              </div>
                              <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4 text-orange-600" />
                                  <span>{item.preparationTime} min</span>
                                </div>
                                <span>•</span>
                                <span className="capitalize bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  {item.spiceLevel}
                                </span>
                              </div>
                              {item.dietaryInfo?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-4">
                                  {item.dietaryInfo.map((diet, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200"
                                    >
                                      {diet}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(menu._id, item)}
                              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-orange-200"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                  <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No menus available
                  </h3>
                  <p className="text-gray-500">
                    Check back later for delicious meals from our chefs
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Orders tab
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-3xl font-bold bg-orange-600 bg-clip-text text-transparent">
                My Orders
              </h2>
              <button
                onClick={refreshOrders}
                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Refresh
              </button>
            </div>

            <div className="bg-gradient-to-br from-white via-orange-50 to-red-50 rounded-2xl shadow-xl border border-white/20">
              <div className="p-6 sm:p-8">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order, index) => (
                      <div
                        key={order._id}
                        className="relative bg-gradient-to-br from-white via-white to-orange-50/50 backdrop-blur-sm border border-orange-100 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group overflow-hidden"
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-4 sm:space-y-0">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-xl group-hover:text-orange-700 transition-colors duration-300">
                                    Order #
                                    {order.orderNumber || order._id.slice(-6)}
                                  </h4>
                                  <p className="text-sm text-gray-600 font-medium">
                                    {new Date(
                                      order.createdAt
                                    ).toLocaleDateString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full shadow-md ${
                                    order.orderType === "delivery"
                                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                      : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                  }`}
                                >
                                  {order.orderType === "delivery" ? "🚚" : "🏪"}
                                  {order.orderType === "delivery"
                                    ? "Delivery"
                                    : "Pickup"}
                                </span>
                                <span
                                  className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full shadow-md ${
                                    order.paymentMethod === "online"
                                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                                      : order.paymentMethod === "upi"
                                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                                      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
                                  }`}
                                >
                                  {order.paymentMethod === "online"
                                    ? "💳"
                                    : order.paymentMethod === "upi"
                                    ? "📱"
                                    : "💵"}
                                  {order.paymentMethod
                                    ?.charAt(0)
                                    .toUpperCase() +
                                    order.paymentMethod?.slice(1)}
                                </span>
                              </div>
                            </div>
                            <div className="text-left sm:text-right space-y-3">
                              <div className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                <p className="font-black text-3xl">
                                  ₹{order.totalAmount}
                                </p>
                              </div>
                              <span
                                className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ${getStatusColorEnhanced(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status?.charAt(0).toUpperCase() +
                                  order.status?.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-5 border border-orange-100/50 shadow-inner">
                            <div className="flex items-center space-x-2 mb-4">
                              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                                <Package className="w-4 h-4 text-white" />
                              </div>
                              <h5 className="text-lg font-bold text-gray-800">
                                Order Items
                              </h5>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                                {order.items?.length} items
                              </span>
                            </div>
                            <div className="grid gap-3">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-orange-100/30 hover:shadow-md transition-all duration-200 hover:bg-white/90"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-orange-300 to-red-300 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                      {item.quantity}x
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-900 text-base">
                                        {item.name}
                                      </span>
                                      <p className="text-sm text-gray-600">
                                        ₹{item.price} each
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-4 pt-4 border-t border-orange-200">
                              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                <span>Items Total:</span>
                                <span>
                                  ₹
                                  {order.totalAmount -
                                    (order.deliveryFee || 0) -
                                    (order.tax || 0)}
                                </span>
                              </div>
                              {order.deliveryFee > 0 && (
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                  <span>Delivery Fee:</span>
                                  <span>₹{order.deliveryFee}</span>
                                </div>
                              )}
                              {order.tax > 0 && (
                                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                  <span>Tax:</span>
                                  <span>₹{order.tax}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-center font-bold text-lg border-t border-orange-200 pt-2">
                                <span className="text-gray-800">
                                  Total Paid:
                                </span>
                                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                  ₹{order.totalAmount}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-2xl border-2 border-dashed border-orange-200">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <ShoppingBag className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                        <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      No orders yet
                    </h3>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      No orders yet
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Start browsing menus to place your first order and enjoy
                      delicious meals!
                    </p>
                    <button
                      onClick={() => setActiveTab("menus")}
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-2xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Browse Menus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Cart Modal */}
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cart}
        updateCartItem={updateCartItem}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </div>
  );
};

export default UserDashboard;
