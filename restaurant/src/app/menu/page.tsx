"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}

// 🔹 Mapping Categories to Images
const categoryImages: Record<string, string> = {
  "All Menu": "/base.jpg", // Add image for "All Menu"
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/tea.png",
  Desserts: "/kheer.jpg",
  Snacks: "/snacks.jpg",
};

// 🔹 Mapping Category IDs to Names
const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  3: "Desserts",
  4: "Snacks",
  5: "Drinks",
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 🔹 Fetch Menu Items from API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        console.log("Fetched Data:", data);
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {!selectedCategory && (
        <div className="text-center mt-32">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Menu</h1>
          <div className="w-24 h-1 bg-black mx-auto rounded-full mb-10"></div>
        </div>
      )}

      {/* 🔹 If a Category is Selected, Show Menu Items */}
      {selectedCategory ? (
        <div>
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-32 mb-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-lg shadow-md
                            hover:from-blue-700 hover:to-indigo-600 transition-transform transform hover:scale-105 active:scale-95"
            >
              ⬅️ Back to Categories
            </button>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-6 tracking-wide uppercase mt-8">
            {selectedCategory} Menu 🍽️
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems
              .filter((item) => selectedCategory === "All Menu" || categoryMapping[item.category_id] === selectedCategory)
              .map((item, index) => (
                <div
                  key={item.id || `menu-item-${index}`}
                  className="shadow-md border border-gray-200 rounded-xl overflow-hidden w-80 mx-auto transform transition duration-300 hover:scale-[1.04] hover:shadow-xl bg-white"
                >
                  {/* 🔹 Food Image */}
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-52 object-cover rounded-t-xl"
                  />

                  <div className="p-3 text-center bg-white rounded-b-xl space-y-1.5">
                    {/* 🔹 Category Label */}
                    <h4 className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block shadow-md">
                      {categoryMapping[item.category_id] || "Uncategorized"}
                    </h4>

                    {/* 🔹 Food Name */}
                    <h3 className="text-2xl font-bold text-gray-900 tracking-wide leading-tight">
                      {item.name}
                    </h3>

                    {/* 🔹 Description */}
                    <p className="text-gray-600 text-xs leading-snug">
                      {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
                    </p>

                    {/* 🔹 Price & Item Number */}
                    <div className="flex justify-between items-center mt-1 px-3">
                      <span className="text-2xl font-extrabold text-red-600 flex items-center gap-1">
                        <span className="drop-shadow-md">${item.price}</span>
                      </span>
                      <span className="text-xl font-bold text-white bg-blue-800 px-3 py-1 rounded-md shadow-md">
                        🏷️ : {item.quantity}
                      </span>
                      {/* 🔹 Item Number (Looks distinct now) */}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        // 🔹 Show Categories with Images
        <div className="flex flex-wrap justify-center gap-10 mt-10">
          {/* ➕ Add "All Menu" Category */}
          <div
            key="All Menu"
            className="relative cursor-pointer shadow-xl border border-gray-200 rounded-3xl overflow-hidden w-80 h-86 pb-2 bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => setSelectedCategory("All Menu")}
          >
            <img
              src={categoryImages["All Menu"] || "/placeholder.jpg"}
              alt="All Menu"
              className="w-full h-60 object-cover rounded-t-3xl"
            />
            <div className="p-5 text-center bg-white">
              <h2 className="text-2xl font-extrabold text-gray-800">All Menu</h2>
              <p className="text-blue-600 font-semibold mt-2 tracking-wide transition-colors duration-300 hover:text-blue-800">
                VIEW ALL ITEMS
              </p>
            </div>
          </div>
          {/* Existing Categories */}
          {Object.values(categoryMapping).map((category) => (
            <div
              key={category} // ✅ Use category name as the key
              className="relative cursor-pointer shadow-xl border border-gray-200 rounded-3xl overflow-hidden w-80 h-86 pb-2 bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              onClick={() => setSelectedCategory(category)}
            >
              <img
                src={categoryImages[category] || "/placeholder.jpg"}
                alt={category}
                className="w-full h-60 object-cover rounded-t-3xl"
              />
              <div className="p-5 text-center bg-white">
                <h2 className="text-2xl font-extrabold text-gray-800">{category}</h2>
                <p className="text-blue-600 font-semibold mt-2 tracking-wide transition-colors duration-300 hover:text-blue-800">
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