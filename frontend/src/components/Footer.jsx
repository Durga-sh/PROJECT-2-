import { ChefHat, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600">
                <ChefHat className="h-5 w-5 text-white" />
              </span>
              <span className="text-lg font-semibold text-gray-900">
                FoodApp
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Order from handpicked menus by local chefs. Fresh. Fast.
              Delicious.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-orange-700">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-700">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-700">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-orange-700">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-700">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-700">
                  Privacy & Terms
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600" /> Anywhere, Earth
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-600" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-600" /> support@foodapp.com
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} FoodApp. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="text-gray-500 hover:text-orange-700">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-700">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-700">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
