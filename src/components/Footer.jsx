import React from "react";
import { ChefHat, MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-yellow-400" />
              <span className="text-xl font-bold">HomeChef</span>
            </div>
            <p className="text-gray-400">
              Connecting food lovers with talented home chefs for fresh, delicious meals delivered to your door.
            </p>
          </div>
          
          {/* Customers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Customers</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Browse Menus</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Track Orders</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Support</a></li>
            </ul>
          </div>
          
          {/* Chefs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Chefs</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Become a Chef</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Chef Resources</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Upload Menu</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Earnings</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@homechef.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Serving your neighborhood</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2024 HomeChef. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
