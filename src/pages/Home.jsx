import { Search, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-400 to-orange-200 text-gray-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold leading-tight text-white">
          Fresh Home-Cooked <span className="text-yellow-200">Meals</span> from
          Your Neighborhood
        </h1>
        <p className="mt-6 text-lg text-orange-100">
          Discover delicious, homemade meals from local chefs. <br />
          Order fresh food made with love, delivered to your door.
        </p>

        {/* Location Search */}
        <div className="mt-10 bg-white rounded-xl shadow-lg flex items-center px-4 py-3 max-w-2xl mx-auto">
          <MapPin className="text-orange-500 mr-3" />
          <input
            type="text"
            placeholder="Enter your address or ZIP code"
            className="flex-1 outline-none text-gray-700"
          />
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg font-semibold">
            Find Food
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
            Order Now
          </button>
          <button className="border border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50">
            Become a Chef
          </button>
        </div>
      </section>

      {/* Example Food Image Section */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <img
          src="https://images.unsplash.com/photo-1600891963930-96053fdf7b0b"
          alt="Delicious Meals"
          className="rounded-2xl shadow-lg"
        />
      </section>
    </div>
  );
}