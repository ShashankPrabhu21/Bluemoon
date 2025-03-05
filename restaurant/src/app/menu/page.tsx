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

// Function to get category-based background color
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Breakfast":
      return "bg-gradient-to-br from-yellow-200 to-orange-500";
    case "Main Course":
      return "bg-gradient-to-br from-green-400 to-green-600";
    case "Snacks":
      return "bg-gradient-to-br from-blue-500 to-indigo-600";
    case "Desserts":
      return "bg-gradient-to-br from-pink-500 to-purple-600";
    case "Drinks":
      return "bg-gradient-to-br from-cyan-400 to-blue-500";
    default:
      return "bg-gray-200";
  }
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
      <h1 className="text-4xl font-bold text-center mb-6 mt-16 text-gray-800">
        Our Menu
      </h1>

      {selectedCategory ? (
        <div>
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
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
                  className={`shadow-lg border border-gray-300 rounded-xl overflow-hidden w-full max-w-sm mx-auto ${getCategoryColor(
                    item.category
                  )}`}
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
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <div
              key={category}
              className="cursor-pointer shadow-xl border rounded-xl overflow-hidden w-64 h-80 transform transition-all duration-300 hover:scale-105"
              onClick={() => setSelectedCategory(category)}
            >
              <img
                src={categoryImages[category] || "/placeholder.jpg"}
                alt={category}
                className="w-full h-3/4 object-cover"
              />
              <div className="p-4 text-center bg-white">
                <h2 className="text-2xl font-bold text-gray-800">{category}</h2>
                <p className="text-blue-500 mt-2">VIEW MENU</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
