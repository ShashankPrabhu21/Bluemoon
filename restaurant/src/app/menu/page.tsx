"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

// 🔹 Mapping Categories to Images
const categoryImages: Record<string, string> = {
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/tea.png",
  Desserts: "/sec2.jpg",
  Snacks: "/sec11.jpg",
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
  .filter((item) => categoryMapping[item.category_id] === selectedCategory)
  .map((item, index) => (
    <div 
      key={item.id || `menu-item-${index}`} // ✅ Ensuring a unique key
      className="shadow-lg border border-gray-300 rounded-xl overflow-hidden w-full max-w-sm mx-auto"
    >

                  {/* 🔹 Display Food Image */}
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-60 object-cover rounded-t-xl"
                  />
                  <div className="p-4 text-center bg-white rounded-b-xl">
                    <h4 className="text-md text-gray-700 bg-gray-300 px-3 py-1 rounded-full inline-block mx-auto">
                      Category: {categoryMapping[item.category_id]}
                    </h4>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 truncate">{item.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-3xl font-semibold text-red-500">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        // 🔹 Show Categories with Images
        <div className="flex flex-wrap justify-center gap-10">
          {Object.values(categoryMapping).map((category) => (
  <div
    key={category}  // ✅ Use category name as the key
    className="relative cursor-pointer shadow-xl border border-gray-200 rounded-3xl overflow-hidden w-80 h-96 pb-2 bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
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