"use client";

import { useState, useEffect } from "react";
import {
  User,
  ChefHat,
  DollarSign,
  Package,
  Clock,
  Star,
  Plus,
  LogOut,
  BarChart3,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Award,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";
import menuAPI from "../api/menu";
import orderAPI from "../api/order";
import CreateMenuModal from "../components/CreateMenuModal";

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const result = await authAPI.getCurrentUser();
        if (result.success) {
          if (result.user.role !== "chef") {
            navigate("/user-dashboard", { replace: true });
            return;
          }
          setUser(result.user);
          // Load data after user is set
          loadDashboardData();
        } else {
          navigate("/login", { replace: true });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load menus, orders, and stats
      const [menusResult, ordersResult, statsResult] = await Promise.all([
        menuAPI.getChefMenus(1, 5),
        orderAPI.getChefOrders(1, 5),
        orderAPI.getChefOrderStats("week"),
      ]);

      if (menusResult.success) setMenus(menusResult.menus || []);
      if (ordersResult.success) setOrders(ordersResult.data?.orders || []);
      if (statsResult.success) setStats(statsResult.data || {});
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuCreated = (newMenu) => {
    setMenus((prev) => [newMenu, ...prev]);
    loadDashboardData(); // Refresh data
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const result = await orderAPI.updateOrderStatus(orderId, status);
      if (result.success) {
        // Refresh orders
        loadDashboardData();
        alert(`Order ${status} successfully!`);
      } else {
        alert(result.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-orange-400 animate-spin animation-delay-150"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Chef Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                  <span className="block text-xs text-orange-600 font-medium">
                    Chef
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
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "border-orange-500 text-orange-600 transform scale-105"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("menus")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === "menus"
                  ? "border-orange-500 text-orange-600 transform scale-105"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Menus
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === "orders"
                  ? "border-orange-500 text-orange-600 transform scale-105"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Orders
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "dashboard" && (
          <div className="animate-fade-in">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-pink-600/20"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-8 h-8 text-white" />
                  <h2 className="text-3xl sm:text-4xl font-bold">
                    Welcome back, Chef {user?.name}!
                  </h2>
                </div>
                <p className="text-orange-100 text-lg">
                  Manage your kitchen, track orders, and grow your culinary
                  business
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setShowCreateMenu(true)}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-2 border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                      Create Menu
                    </h3>
                    <p className="text-sm text-gray-600">Add new daily menu</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("menus")}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-2 border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      Manage Menus
                    </h3>
                    <p className="text-sm text-gray-600">Edit existing menus</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-2 border border-white/20"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                      View Orders
                    </h3>
                    <p className="text-sm text-gray-600">Track order status</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {stats.totalOrders || 0}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      Total Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{stats.totalRevenue || 0}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">Revenue</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      ₹{Math.round(stats.averageOrderValue || 0)}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      Avg Order Value
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {stats.pendingOrders || 0}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      Pending Orders
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <Activity className="w-6 h-6 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Recent Orders
                </h3>
              </div>
              <div className="space-y-4">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <div
                      key={order._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 space-y-3 sm:space-y-0"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">
                            Order #{order.orderNumber || order._id.slice(-6)}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.customer?.name} • {order.items?.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No orders yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "menus" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Your Menus
              </h2>
              <button
                onClick={() => setShowCreateMenu(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                <span>Create Menu</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {menus.length > 0 ? (
                menus.map((menu, index) => (
                  <div
                    key={menu._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {new Date(menu.date).toLocaleDateString()}
                        </h3>
                        <p className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full inline-block">
                          {menu.items?.length} items
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-green-600 transition-colors duration-200 p-2 hover:bg-green-50 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      {menu.items?.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm bg-white/60 rounded-lg p-3"
                        >
                          <span className="text-gray-700 font-medium">
                            {item.name}
                          </span>
                          <span className="text-green-600 font-bold">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                      {menu.items?.length > 3 && (
                        <p className="text-xs text-gray-500 text-center bg-gray-100 rounded-lg py-2">
                          +{menu.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        Order by:{" "}
                        {new Date(menu.orderDeadline).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          menu.isAcceptingOrders?.()
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {menu.isAcceptingOrders?.() ? "Active" : "Closed"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No menus yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first menu to start receiving orders
                  </p>
                  <button
                    onClick={() => setShowCreateMenu(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Create Your First Menu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Orders
            </h2>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="p-6 sm:p-8">
                <div className="space-y-6">
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <div
                        key={order._id}
                        className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 space-y-3 lg:space-y-0">
                          <div className="space-y-2">
                            <h4 className="font-bold text-gray-900 text-xl">
                              Order #{order.orderNumber || order._id.slice(-6)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.customer?.name} • {order.customer?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-left lg:text-right">
                            <p className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
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

                        <div className="bg-white/40 rounded-lg p-4 mb-4">
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
                                <span className="font-bold text-orange-600">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.status === "pending" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order._id, "confirmed")
                              }
                              className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 font-medium"
                            >
                              Confirm Order
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order._id, "cancelled")
                              }
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-medium"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}

                        {order.status === "confirmed" && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order._id, "preparing")
                              }
                              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
                            >
                              Start Preparing
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateOrderStatus(order._id, "cancelled")
                              }
                              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-medium"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order._id, "ready")
                            }
                            className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 font-medium"
                          >
                            Mark as Ready
                          </button>
                        )}

                        {order.status === "ready" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(order._id, "delivered")
                            }
                            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 transform hover:scale-105 font-medium"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-500">
                        Orders will appear here when customers place them
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Menu Modal */}
      <CreateMenuModal
        isOpen={showCreateMenu}
        onClose={() => setShowCreateMenu(false)}
        onMenuCreated={handleMenuCreated}
      />
    </div>
  );
};

export default ChefDashboard;
