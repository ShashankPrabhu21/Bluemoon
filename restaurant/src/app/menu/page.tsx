"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number; // Ensure 'id' is always present and unique for each item
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
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<FoodItem[] | null>(null); // This will hold all preloaded data

  // Preload all menu items in background after initial render
  useEffect(() => {
    (async () => {
      try {
        console.log("Preloading all menu items in background...");
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch all data during preload");
        const data = await res.json();
        setAllData(data);
        console.log("All menu items preloaded.");
      } catch (err) {
        console.error("Background preload failed:", err);
      }
    })();
  }, []); // Empty dependency array means this runs once on mount

  const handleCategoryClick = async (category: string | null) => {
    // If we're already on this category or trying to go back to categories when already there, do nothing.
    if (selectedCategory === category && category !== null) return;

    setSelectedCategory(category);
    setError(null);

    // If going back to the category selection screen, clear displayed items and return.
    if (category === null) {
      setMenuItems([]);
      return;
    }

    // --- Logic for displaying items based on `allData` or fetching ---

    // Scenario 1: User clicked "All Menu" or `allData` is not yet preloaded
    if (category === "All Menu" || !allData) {
      setLoading(true);
      try {
        const url = "/api/menuitem"; // This fetches ALL items
        console.log("Fetching ALL menu items on user click:", url);
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch all menu items on click");
        const data = await res.json();
        setMenuItems(data); // Display all items
        setAllData(data); // Cache this data for future category filtering
      } catch (err) {
        console.error("Error fetching 'All Menu' or initial data:", err);
        setError("Failed to load all menu items. Please try again.");
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    }
    // Scenario 2: User clicked a specific category AND `allData` is already preloaded
    else if (allData && category !== "All Menu") {
      console.log("Filtering from preloaded data for category:", category);
      const filtered = allData.filter(
        (item) => categoryMapping[item.category_id] === category
      );
      setMenuItems(filtered); // Display filtered items instantly
    }
  };

  // `groupedMenuItems` will use `allData` for grouping when "All Menu" is selected.
  // We ensure it's not null before reducing.
  const groupedMenuItems = (allData || []).reduce((acc, item) => {
    const catName = categoryMapping[item.category_id] || "Uncategorized";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  // --- Reusable Component for Food Item Cards (with lazy loading) ---
  const Card = ({ item }: { item: FoodItem }) => (
    <div className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 bg-white/30 backdrop-blur-md hover:bg-white/40">
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
          {item.description.length > 50
            ? `${item.description.slice(0, 50)}...`
            : item.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-lg font-bold text-red-400">${item.price}</span>
          <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md">
            🏷️ {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url(/sec11.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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

        {/* Loading Indicator for products (shown on first category click, or if preload fails) */}
        {loading && (
          <div className="flex justify-center items-center mt-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <span className="ml-3 text-white font-semibold">Loading menu...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center mt-32 text-red-500 font-bold text-lg">{error}</div>
        )}

        {/* Display Categories initially (instant load) */}
        {!loading && !selectedCategory && (
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: "All Menu" },
              ...Object.values(categoryMapping).map((label) => ({ label })),
            ].map(({ label }) => (
              <div
                key={label} // Category labels are unique, so `label` is a good key here
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
                // Use groupedMenuItems (which uses allData).
                // Ensure the map for categories also has a key.
                ["Breakfast", "Main Course", "Entree", "Drinks"].map((category) => (
                  <div key={category} className="mb-10"> {/* Key for category div */}
                    <h2 className="text-3xl text-white font-bold mb-4">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {/* Using item.id for key, with a fallback if item.id is missing */}
                      {groupedMenuItems[category]?.map((item, index) => (
                        <Card key={item.id ?? `${category}-${index}`} item={item} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // For a specific category, display items from `menuItems` (filtered from allData)
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Using item.id for key, with a fallback if item.id is missing */}
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