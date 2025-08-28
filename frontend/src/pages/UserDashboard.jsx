import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  Clock,
  Star,
  Search,
  Filter,
  Heart,
  LogOut,
  LogIn,
  UserPlus,
  Plus,
  ShoppingCart,
  MapPin,
  ChefHat,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import authAPI from "../api/auth";
import menuAPI from "../api/menu";
import orderAPI from "../api/order";
import CartModal from "../components/CartModal";

const UserDashboard = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await authAPI.getCurrentUser();
        if (result.success) {
          if (result.user.role === "chef") {
            navigate("/chef-dashboard", { replace: true });
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
        loadAvailableMenus(); // Load menus even for non-authenticated users
      }
    };

    checkAuthStatus();
  }, [navigate]);

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
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const addToCart = (menuId, item) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate("/login");
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
      } else {
        return [...prev, { ...item, menuId, quantity: 1 }];
      }
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

  const clearCart = () => {
    setCart([]);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-orange-100 text-orange-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      menu.items?.some((item) => item.cuisine === selectedCuisine);

    return matchesSearch && matchesCuisine;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-emerald-400 animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FoodApp
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-emerald-600 transition-all duration-200 hover:bg-emerald-50 rounded-lg group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-sm font-medium hidden sm:block">
                    Cart
                  </span>
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {getCartItemCount()}
                    </span>
                  )}
                </button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                      <span className="block text-xs text-emerald-600 font-medium">
                        User
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-all duration-200 hover:bg-red-50 rounded-lg px-2 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-4 py-2 text-emerald-600 hover:text-emerald-700 transition-all duration-200 hover:bg-emerald-50 rounded-lg"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm font-medium">Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs for authenticated users */}
      {isAuthenticated && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("menus")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === "menus"
                    ? "border-emerald-500 text-emerald-600 transform scale-105"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Browse Menus
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                  activeTab === "orders"
                    ? "border-emerald-500 text-emerald-600 transform scale-105"
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isAuthenticated ? (
          <div className="animate-fade-in">
            {/* Welcome Section for non-authenticated users */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 animate-slide-up">
                  Welcome to FoodApp!
                </h2>
                <p className="text-emerald-100 mb-6 text-lg animate-slide-up animation-delay-200">
                  Discover delicious meals from talented local chefs. Join us
                  today to start your culinary journey!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                  <Link
                    to="/register"
                    className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-emerald-600 transition-all duration-200 transform hover:scale-105 text-center"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Sample menus for guests */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
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
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
                      {menu.items?.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm bg-white/40 rounded-lg p-2"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.name}
                          </span>
                          <span className="text-emerald-600 font-bold">
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
                    <Link
                      to="/login"
                      className="w-full inline-block py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
                    >
                      Login to Order
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Welcome Section for authenticated users */}
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-emerald-100 text-lg">
                  Discover delicious meals from talented local chefs
                </p>
              </div>
            </div>

            {activeTab === "menus" && (
              <div className="space-y-8">
                {/* Search and Filter */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors duration-200" />
                      <input
                        type="text"
                        placeholder="Search for dishes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                      />
                    </div>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-white/60 backdrop-blur-sm hover:bg-white/80 min-w-[200px]"
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
                </div>

                {/* Available Menus */}
                <div className="space-y-8">
                  {filteredMenus.length > 0 ? (
                    filteredMenus.map((menu, menuIndex) => (
                      <div
                        key={menu._id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 hover:shadow-2xl transition-all duration-300"
                        style={{ animationDelay: `${menuIndex * 100}ms` }}
                      >
                        {/* <CHANGE> Enhanced menu header with better styling */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 space-y-4 sm:space-y-0">
                          <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                              Chef's Menu -{" "}
                              {new Date(menu.date).toLocaleDateString()}
                            </h3>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                              Order deadline:{" "}
                              {new Date(menu.orderDeadline).toLocaleString()}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {menu.deliveryAvailable && (
                                <span className="text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full border border-green-200">
                                  🚚 Delivery Available
                                </span>
                              )}
                              {menu.pickupAvailable && (
                                <span className="text-sm bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                                  🏪 Pickup Available
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* <CHANGE> Enhanced menu items grid with better animations */}
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
                                style={{
                                  animationDelay: `${itemIndex * 50}ms`,
                                }}
                              >
                                <div className="mb-4">
                                  <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                                    {item.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                      ₹{item.price}
                                    </span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                      {item.availableQuantity} left
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4 text-emerald-500" />
                                      <span>{item.preparationTime} min</span>
                                    </div>
                                    <span>•</span>
                                    <span className="capitalize bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                                      {item.spiceLevel}
                                    </span>
                                  </div>
                                  {item.dietaryInfo?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-4">
                                      {item.dietaryInfo.map((diet, index) => (
                                        <span
                                          key={index}
                                          className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full border border-purple-200"
                                        >
                                          {diet}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => addToCart(menu._id, item)}
                                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl group-hover:shadow-emerald-200"
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
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    My Orders
                  </h2>
                  <button
                    onClick={refreshOrders}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Refresh
                  </button>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                  <div className="p-6 sm:p-8">
                    {orders.length > 0 ? (
                      <div className="space-y-6">
                        {orders.map((order, index) => (
                          <div
                            key={order._id}
                            className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            {/* <CHANGE> Enhanced order display with better styling */}
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                              <div className="space-y-1">
                                <h4 className="font-bold text-gray-900 text-lg">
                                  Order #
                                  {order.orderNumber || order._id.slice(-6)}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm text-emerald-600 font-medium">
                                  {order.orderType === "delivery"
                                    ? "🚚 Delivery"
                                    : "🏪 Pickup"}
                                </p>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                  ₹{order.totalAmount}
                                </p>
                                <span
                                  className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status?.charAt(0).toUpperCase() +
                                    order.status?.slice(1)}
                                </span>
                              </div>
                            </div>

                            <div className="bg-white/40 rounded-lg p-4">
                              <h5 className="text-sm font-semibold text-gray-700 mb-3">
                                Items:
                              </h5>
                              <div className="space-y-2">
                                {order.items?.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between text-sm bg-white/60 rounded-lg p-2"
                                  >
                                    <span className="font-medium">
                                      {item.name} x {item.quantity}
                                    </span>
                                    <span className="font-bold text-emerald-600">
                                      ₹{item.price * item.quantity}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No orders yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Start browsing menus to place your first order
                        </p>
                        <button
                          onClick={() => setActiveTab("menus")}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Browse Menus
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

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
