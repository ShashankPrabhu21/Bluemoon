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

const categoryImages: Record<string, string> = {
  "All Menu": "/base.jpg",
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/tea.png",
  Entree: "/snacks.jpg",
};

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const MenuPage = () => {
  // `menuItems` will now only hold the items for the CURRENTLY selected category.
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  // `selectedCategory` being `null` means we are showing the category selection screen.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // `loading` state tracks fetching for the *currently selected* category.
  const [loading, setLoading] = useState(false); // Initialize as false, NO initial fetch of products
  const [error, setError] = useState<string | null>(null);

  // This function handles fetching items for a specific category OR all items if "All Menu" is passed.
  const fetchCategoryItems = async (category: string | null) => {
    setLoading(true);
    setError(null);
    try {
      let url = "/api/menuitem"; // Default API call for "All Menu"
      if (category && category !== "All Menu") {
        url = `/api/menuitem?category=${encodeURIComponent(category)}`;
      }

      console.log("Fetching URL:", url); // For debugging
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Failed to fetch menu items: ${res.statusText}`);
      }
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please try again.");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚨🚨 CRITICAL PART FOR IMMEDIATE INITIAL LOAD 🚨🚨
  // The useEffect hook is now EMPTY. This means NO data fetching happens on initial component mount.
  // The component will render the category selection screen instantly.
  useEffect(() => {
    // Leave this empty. No initial fetch of menu items.
  }, []);

  // `groupedMenuItems` will only be used when "All Menu" is selected.
  // It uses `menuItems` (which will contain all items when "All Menu" is clicked).
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const catName = categoryMapping[item.category_id] || "Uncategorized";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const handleCategoryClick = (category: string | null) => {
    // Prevent re-fetching if the same category is clicked multiple times
    if (selectedCategory === category && category !== null) {
      return;
    }

    setSelectedCategory(category);
    // If a category is selected (not null, meaning not going back to categories),
    // then fetch the items for that specific category.
    if (category !== null) {
      fetchCategoryItems(category);
    } else {
      // When going back to the category selection screen, clear the displayed items.
      setMenuItems([]);
    }
  };

  // --- Reusable Component for Food Item Cards (with lazy loading) ---
  const Card = ({ item }: { item: FoodItem }) => (
    <div className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 bg-white/30 backdrop-blur-md hover:bg-white/40">
      {/* ✨ LAZY LOADING FOR PRODUCT IMAGES HERE ✨ */}
      <img
        src={item.image_url || "/placeholder.jpg"}
        alt={item.name}
        className="w-full h-52 object-cover"
        loading="lazy" // Critical for images to load as user scrolls
      />
      <div className="p-4 bg-black/30 text-white">
        <h4 className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block mb-2">
          {categoryMapping[item.category_id] || "Uncategorized"}
        </h4>
        <h3 className="text-xl font-bold">{item.name}</h3>
        <p className="text-sm text-white/90">
          {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-red-400">${item.price}</span>
          <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md">🏷️ {item.quantity}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{ backgroundImage: "url(/sec11.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black opacity-70" />
      <div className="relative z-10 min-h-screen p-6">
        {/* Initial title when no category is selected */}
        {!selectedCategory && (
          <div className="text-center mt-32">
            <h1 className="text-4xl font-bold text-white mb-2">Our Menu</h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full mb-10"></div>
          </div>
        )}

        {/* Loading Indicator for products (shown after category click) */}
        {loading && (
          <div className="flex justify-center items-center mt-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <span className="ml-3 text-white font-semibold">Loading menu...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center mt-32 text-red-500 font-bold text-lg">
            {error}
          </div>
        )}

        {/* Display Categories initially (instant load) */}
        {!loading && !selectedCategory && (
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: "All Menu" },
              ...Object.values(categoryMapping).map((label) => ({ label })),
            ].map(({ label }) => (
              <div
                key={label}
                onClick={() => handleCategoryClick(label)}
                className="relative group w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={categoryImages[label] || "/placeholder.jpg"}
                  alt={label}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy" // Lazy load category display images
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-bold">{label}</h3>
                </div>
                {/* Optional border glow on hover */}
                <div className="absolute inset-0 border border-transparent rounded-3xl group-hover:border-white/20 group-hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.2)] transition-all duration-300"></div>
              </div>
            ))}
          </div>
        )}

        {/* Display selected category products (after category click) */}
        {!loading && selectedCategory && (
          <>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => handleCategoryClick(null)}
                className="mt-12 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-full shadow-xl hover:scale-105"
              >
                ⬅️ Back to Categories
              </button>
            </div>

            <div className="mt-12">
              {selectedCategory === "All Menu" ? (
                // When "All Menu" is selected, group items by category for display
                // menuItems will contain ALL items if "All Menu" was clicked.
                ["Breakfast", "Main Course", "Entree", "Drinks"].map((category) => (
                  <div key={category} className="mb-10">
                    <h2 className="text-3xl text-white font-bold mb-4">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {groupedMenuItems[category]?.map((item, index) => (
                        <Card key={item.id ?? `${category}-${index}`} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // For a specific category, display all items in `menuItems`
                // (these items were already filtered by the API call when the category was clicked).
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {menuItems.map((item, index) => (
                    <Card key={item.id ?? `filtered-${index}`} item={item} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;