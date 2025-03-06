"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number;
  category: string;
  foodName: string;
  price: string;
  token: string;
  description: string;
  image: string;
}

const categoryImages: Record<string, string> = {
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/drinks.png",
  Desserts: "/sec2.jpg",
  Snacks: "/sec11.jpg",
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const storedMenu = localStorage.getItem("menuItems");
    if (storedMenu) {
      setMenuItems(JSON.parse(storedMenu));
    }
  }, []);

  const categories = Object.keys(categoryImages);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!selectedCategory && (
        <h1 className="text-4xl font-bold text-center mb-6 mt-32 text-gray-800">
          Our Menu
        </h1>
      )}


      {selectedCategory ? (
        <div>
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-32 mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Back to Categories
            </button>
          </div>
          <h2 className="text-3xl font-semibold text-center mb-4">
            {selectedCategory} Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems
              .filter((item) => item.category === selectedCategory)
              .map((item) => (
                <div
                  key={item.id}
                  className="shadow-lg border border-gray-300 rounded-xl overflow-hidden w-full max-w-sm mx-auto"
                >
                  <img
                    src={item.image}
                    alt={item.foodName}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-4 text-center bg-white rounded-b-xl">
                    <h4 className="text-md text-gray-700 bg-gray-300 px-3 py-1 rounded-full inline-block mx-auto">
                      Category: {item.category}
                    </h4>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                      {item.foodName}
                    </h3>
                    <p className="text-gray-600 truncate">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-3xl font-semibold text-red-500">
                        ${item.price}
                      </span>
                      <span className="text-2xl font-medium text-gray-700">
                        <span className="text-lg">Token:</span> {item.token}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-10">
  {categories.map((category) => (
    <div
      key={category}
      className="relative cursor-pointer shadow-xl border border-gray-200 rounded-3xl overflow-hidden w-80 h-96 pb-2 bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onClick={() => setSelectedCategory(category)}
    >
      {/* Image Section */}
      <div className="relative w-full h-4/5">
        <img
          src={categoryImages[category] || "/placeholder.jpg"}
          alt={category}
          className="w-full h-full object-cover rounded-t-3xl transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <p className="text-white text-lg font-semibold tracking-wide">
            Explore {category}
          </p>
        </div>
      </div>

      {/* Text Section */}
      <div className="p-5 text-center bg-white ">
        <h2 className="text-2xl font-extrabold text-gray-800">{category}</h2>
        <p className="text-blue-600 font-semibold  mt-2 tracking-wide transition-colors duration-300 hover:text-blue-800">
          VIEW MENU
        </p>
      </div>
    </div>
  ))}
</div>

      )}
    </div>
  );
};

export default MenuPage;