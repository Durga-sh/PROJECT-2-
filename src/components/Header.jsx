import { useState } from "react";
import { ChefHat, Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo (left) */}
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold text-foreground">HomeChef</span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-orange-600">
              Services
            </Link>
          </div>

          {/* Right CTA buttons */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Sign In
            </Link>
            <Link
              to="/chef-register"
              className="bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition border border-orange-400"
            >
              Join as a Chef
            </Link>
          </div>

          {/* Mobile only: Profile + Menu */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"
              >
                <User size={20} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-md">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-orange-600 hover:bg-orange-50 font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/chef-register"
                    className="block px-4 py-2 text-orange-600 hover:bg-orange-50 font-medium"
                    onClick={() => setProfileOpen(false)}
                  >
                    Join as a Chef
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-600"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 shadow-md">
          <Link
            to="/"
            className="block text-gray-700 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/services"
            className="block text-gray-700 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/login"
            className="block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-center"
            onClick={() => setIsOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/chef-register"
            className="block bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition border border-orange-400 text-center"
            onClick={() => setIsOpen(false)}
          >
            Join as a Chef
          </Link>
        </div>
      )}
    </nav>
  );
}
