import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-orange-600">Rasoi</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-600">
              About
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-orange-600">
              Services
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600">
              Contact
            </Link>
          </div>

          {/* Profile + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Profile Button */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600"
              >
                <User size={20} />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
                    onClick={() => setProfileOpen(false)} // closes dropdown
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-orange-600"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
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
            to="/about"
            className="block text-gray-700 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            to="/services"
            className="block text-gray-700 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-orange-600"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}