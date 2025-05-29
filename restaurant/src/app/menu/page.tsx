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
  Entree: "/snacks.jpg",
};

// 🔹 Mapping Category IDs to Names
const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // State to track loading

  const fetchMenuItems = async (category: string | null) => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const url = `/api/menuitem${category && category !== "All Menu" ? `?category=${category}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      console.log(`Fetched Data for ${category || 'All'}:`, data);
      setMenuItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      // Optionally set an error state here
    } finally {
      setLoading(false); // Set loading to false when fetching completes
    }
  };

  useEffect(() => {
   
  }, []);

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const categoryName = categoryMapping[item.category_id] || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    fetchMenuItems(category); // Fetch data when a category is clicked
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(/sec11.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <div className="relative z-10 min-h-screen p-6">
        {!selectedCategory && (
          <div className="text-center mt-32">
            <h1 className="text-4xl font-bold text-white mb-2">Our Menu</h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full mb-10"></div>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center mt-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white-500"></div>
            <span className="ml-3 text-white font-semibold">Loading menu...</span>
          </div>
        )}

{!loading && selectedCategory && selectedCategory !== "All Menu" && (
  <div>
    {/* Back Button */}
    <div className="flex justify-center mt-32">
      <button
        onClick={() => handleCategoryClick(null)}
        className="mb-4 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-600 active:scale-95"
      >
        ⬅️ Back to Categories
      </button>
    </div>

    {/* ✨ Selected Category Title */}
    <h2 className="text-4xl font-extrabold text-white text-center mb-6 tracking-wide uppercase mt-8">
      {selectedCategory} Menu 🍽️
    </h2>

    {/* 🍽️ Food Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {menuItems.map((item, index) => (
        <div
          key={item.id || `menu-item-${index}`}
          className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-[1.04] hover:shadow-2xl bg-white/30 backdrop-blur-md hover:bg-white/40"
        >
          {/* 📸 Food Image */}
          <img
            src={item.image_url || "/placeholder.jpg"}
            alt={item.name}
            className="w-full h-52 object-cover rounded-t-xl"
          />

          <div className="p-3 text-center bg-black/30 rounded-b-xl space-y-1.5">
            {/* 🔹 Category Label */}
            <h4 className="text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block shadow-md">
              {categoryMapping[item.category_id] || "Uncategorized"}
            </h4>

            {/*  Food Name */}
            <h3 className="text-2xl font-bold text-white tracking-wide leading-tight drop-shadow-lg">
              {item.name}
            </h3>

            {/*  Description */}
            <p className="text-white/90 text-xs leading-snug drop-shadow-md">
              {item.description.length > 50
                ? `${item.description.substring(0, 50)}...`
                : item.description}
            </p>

            {/*  Price & Item Number */}
            <div className="flex justify-between items-center mt-1 px-3">
              <span className="text-2xl font-extrabold text-red-600 flex items-center gap-1">
                <span className="drop-shadow-md">${item.price}</span>
              </span>
              <span className="text-xl font-bold text-white bg-blue-800 px-3 py-1 rounded-md shadow-lg backdrop-blur-sm">
                🏷️ : {item.quantity}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        {/*  Section-wise display under "All Menu" - Direct Display */}
        {!loading && selectedCategory === "All Menu" && (
          <div className="mt-32 space-y-16 px-4">
            {/* 🔙 Back Button */}
            <div className="flex justify-center mb-8">
              <button
                onClick={() => handleCategoryClick(null)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-600 active:scale-95"
              >
                ⬅️ Back to Categories
              </button>
            </div>

            {/* 🔁 Loop through each category with custom order */}
            {["Breakfast", "Main Course", "Entree", "Drinks"].map((category) => (
              <div key={category} className="space-y-8">
                {/* 🔹 Category Header */}
                <div className="relative py-8">
                  {/* 🌟 Glowing Divider Line */}
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]"></div>
                  </div>

                  {/* ✨ Floating Label */}
                  <div className="relative flex justify-center">
                    <span className="bg-white/20 text-white text-2xl font-extrabold px-6 py-2 rounded-full backdrop-blur-md shadow-xl border border-white/30 tracking-wide capitalize transition-all duration-300 hover:scale-105">
                      {category}
                    </span>
                  </div>
                </div>

                {/* 🍽️ Food Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {groupedMenuItems[category]?.map((item, index) => (
                    <div
                      key={item.id || `all-menu-item-${index}`}
                      className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/30 shadow-xl hover:shadow-2xl hover:scale-[1.05] transform transition duration-300"
                    >
                      {/* 📸 Food Image */}
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-full h-52 object-cover rounded-t-3xl"
                      />

                      {/* 🧊 Card Content */}
                      <div className="p-4 space-y-2 text-center text-white bg-black/30">
                        {/* 🔹 Category Label */}
                        <h4 className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block shadow-xl">
                          {category}
                        </h4>

                        {/* 🍛 Food Name */}
                        <h3 className="text-2xl font-bold tracking-wide leading-tight drop-shadow-lg text-white">
                          {item.name}
                        </h3>

                        {/* 📝 Description */}
                        <p className="text-sm text-white/90 drop-shadow-md">
                          {item.description.length > 50
                            ? `${item.description.substring(0, 50)}...`
                            : item.description}
                        </p>

                        {/* 💲 Price & Quantity */}
                        <div className="flex justify-between items-center mt-2 px-3">
                          <span className="text-lg font-bold text-red-200 drop-shadow-md">
                            ${item.price}
                          </span>
                          <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md text-white backdrop-blur-lg">
                            🏷️ {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/*  Show Categories with Images */}
        {!loading && !selectedCategory && (
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[{ label: "All Menu" }, ...Object.values(categoryMapping).map((cat) => ({ label: cat }))].map(({ label }) => (
              <div
                key={label}
                onClick={() => handleCategoryClick(label)}
                className="relative group w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={categoryImages[label] || "/placeholder.jpg"}
                    alt={label}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-end h-full p-6">
                  <div className="backdrop-blur-md bg-white/20 rounded-xl p-4">
                    <h2 className="text-3xl font-extrabold text-white drop-shadow-lg mb-2 tracking-wider">
                      {label}
                    </h2>
                    <p className="text-white text-sm font-medium tracking-widest uppercase">
                      {label === "All Menu" ? "View All Items" : "Explore This Category"}
                    </p>
                  </div>
                </div>

                {/* 🔹 Optional border glow on hover */}
                <div className="absolute inset-0 border border-transparent rounded-3xl group-hover:border-white/20 group-hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.2)] transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
