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
  const [allItems, setAllItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all items once when page loads
    const fetchAllItems = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/menuitem");
        const data = await res.json();
        setAllItems(data);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllItems();
  }, []);

  const filteredItems = selectedCategory && selectedCategory !== "All Menu"
    ? allItems.filter(item => categoryMapping[item.category_id] === selectedCategory)
    : allItems;

  const groupedItems = allItems.reduce((acc, item) => {
    const catName = categoryMapping[item.category_id] || "Uncategorized";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {} as Record<string, FoodItem[]>);

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{ backgroundImage: "url(/sec11.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black opacity-70" />
      <div className="relative z-10 min-h-screen p-6">
        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center mt-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            <span className="ml-3 text-white font-semibold">Loading menu...</span>
          </div>
        ) : (
          <>
            {/* Categories */}
            {!selectedCategory && (
              <div className="flex flex-wrap justify-center gap-10 mt-16">
                {[{ label: "All Menu" }, ...Object.values(categoryMapping).map(label => ({ label }))].map(({ label }) => (
                  <div key={label} onClick={() => handleCategoryClick(label)}
                    className="relative group w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
                    <img src={categoryImages[label] || "/placeholder.jpg"} alt={label}
                      className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <h3 className="text-white text-2xl font-bold">{label}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Back Button and Filtered Items/All Items Display */}
            {selectedCategory && (
              <>
                <div className="flex justify-center mt-12">
                  <button onClick={() => handleCategoryClick(null)}
                    className="mt-12 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-full shadow-xl hover:scale-105">
                    ⬅️ Back to Categories
                  </button>
                </div>

                <div className="mt-12">
                  {selectedCategory === "All Menu" ? (
                    ["Breakfast", "Main Course", "Entree", "Drinks"].map(category => (
                      <div key={category} className="mb-10">
                        <h2 className="text-3xl text-white font-bold mb-4">{category}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {groupedItems[category]?.map((item, index) => (
                            <Card key={item.id ?? `${category}-${index}`} item={item} />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredItems.map((item, index) => (
                        <Card key={item.id ?? `filtered-${index}`} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Card = ({ item }: { item: FoodItem }) => (
  <div className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 bg-white/30 backdrop-blur-md hover:bg-white/40">
    <img src={item.image_url || "/placeholder.jpg"} alt={item.name} className="w-full h-52 object-cover" />
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

export default MenuPage;