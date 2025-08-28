import React, { useState, useEffect } from "react";
import {
  User,
  ChefHat,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  Star,
  Plus,
  LogOut,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import authAPI from "../api/auth";

const ChefDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Chef Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Chef
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, Chef {user?.name}!
          </h2>
          <p className="text-orange-100">
            Manage your kitchen, track orders, and grow your culinary business
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Add New Dish
                </h3>
                <p className="text-sm text-gray-600">Create a new menu item</p>
              </div>
            </div>
          </button>
          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Menu
                </h3>
                <p className="text-sm text-gray-600">Edit existing dishes</p>
              </div>
            </div>
          </button>
          <button className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  View Analytics
                </h3>
                <p className="text-sm text-gray-600">Track performance</p>
              </div>
            </div>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">24</h3>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+12% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">$1,250</h3>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+8% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">4.8</h3>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">+0.2 from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">3</h3>
                <p className="text-sm text-gray-600">Pending Orders</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-orange-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">Needs attention</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Orders
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div
                key={order}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Order #{order}234
                    </h4>
                    <p className="text-sm text-gray-600">
                      Customer {order} • 2 items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">$45.{order}0</p>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order === 1
                        ? "bg-yellow-100 text-yellow-800"
                        : order === 2
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order === 1
                      ? "Preparing"
                      : order === 2
                      ? "Ready"
                      : "Delivered"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Menu</h3>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              Add New Dish
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((dish) => (
              <div key={dish} className="border border-gray-200 rounded-lg p-4">
                <div className="h-32 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg mb-3 flex items-center justify-center">
                  <ChefHat className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Signature Dish {dish}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Delicious and popular item
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-600">
                    $15.{dish}0
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">4.{dish + 5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChefDashboard;
