import React from "react";
import { MapPin, Star, Clock } from "lucide-react";

const FeaturedChefs = () => {
  const chefs = [
    {
      name: "Maria Rodriguez",
      cuisine: "Mexican",
      rating: 4.9,
      distance: "0.8 miles",
      specialty: "Authentic Tacos",
      price: "$12-18",
      time: "30-45 min",
      image: "/api/placeholder/300/200",
    },
    {
      name: "David Chen",
      cuisine: "Asian Fusion",
      rating: 4.8,
      distance: "1.2 miles",
      specialty: "Fresh Dumplings",
      price: "$15-22",
      time: "25-40 min",
      image: "/api/placeholder/300/200",
    },
    {
      name: "Anna Thompson",
      cuisine: "Mediterranean",
      rating: 4.9,
      distance: "0.5 miles",
      specialty: "Grilled Seafood",
      price: "$18-25",
      time: "35-50 min",
      image: "/api/placeholder/300/200",
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Home Chefs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover amazing meals from talented home cooks near you
          </p>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs.map((chef, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image + Badge + Rating */}
              <div className="relative">
                <img
                  src={chef.image}
                  alt={chef.name}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/90 text-gray-800 text-sm px-3 py-1 rounded-md shadow">
                  {chef.cuisine}
                </span>
                <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1 shadow">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{chef.rating}</span>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{chef.name}</h3>
                  <p className="text-red-500 font-medium">{chef.specialty}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{chef.distance}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{chef.time}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    {chef.price}
                  </span>
                  <button className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition">
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition">
            View All Chefs
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedChefs;
