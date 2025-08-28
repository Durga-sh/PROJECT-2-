import React from "react";
import { Search, ChefHat, Truck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-yellow-500" />,
      title: "Browse Local Menus",
      description:
        "Discover fresh, homemade meals from talented chefs in your neighborhood.",
    },
    {
      icon: <ChefHat className="h-8 w-8 text-red-500" />,
      title: "Order from Home Chefs",
      description:
        "Choose your favorite dishes and support local home cooks in your community.",
    },
    {
      icon: <Truck className="h-8 w-8 text-green-500" />,
      title: "Fresh Delivery",
      description:
        "Get your delicious, freshly prepared meals delivered right to your door.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get fresh, homemade meals in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="absolute top-4 right-4 text-3xl font-bold text-gray-200">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
