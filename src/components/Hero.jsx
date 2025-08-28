import React from "react";
import { MapPin, Search } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 min-h-screen flex items-center">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center max-w-6xl mx-auto">
          {/* Left Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-gray-900">
                Fresh Home-Cooked
                <span className="text-orange-600"> Meals</span> from Your Neighborhood
              </h1>
              <p className="text-xl text-gray-700 max-w-lg">
                Discover delicious, homemade meals from local chefs. Order fresh food made with love, delivered to your door.
              </p>
            </div>

            {/* Search + Find Food */}
            <div className="bg-white/90 backdrop-blur rounded-lg p-4 space-y-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium">Deliver to your location</span>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    placeholder="Enter your address or ZIP code" 
                    className="pl-10 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <button className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition">
                  Find Food
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 sm:flex-none px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Order Now
              </button>
              <button className="flex-1 sm:flex-none px-6 py-3 border border-orange-300 text-gray-900 bg-white/70 hover:bg-white rounded-lg">
                Become a Chef
              </button>
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img 
                src="public/pizza.jpg"
                alt="Delicious homemade meals" 
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm font-medium">100+ Local Chefs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
