"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import OrderModal from "../components/OrderModal";

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: string;
  spicy_level: string;
  quantityAdded?: number;
  specialNote?: string;
}

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  3: "Desserts",
  4: "Snacks",
  5: "Drinks",
};

const OnlineOrderPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<FoodItem[]>([]);
  const categories = Object.values(categoryMapping);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();

    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, []);

  const addToCart = (item: FoodItem, quantity: number, specialNote: string) => {
    const newItem = { ...item, quantityAdded: quantity, specialNote };
    const updatedCart = [...cart, newItem];

    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  return (
    <div className="min-h-screen bg-white p-6 mt-32">
      <div className="flex justify-center items-center relative mb-10">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide">Online Order</h1>
        <Link
          href="/cart"
          className="absolute right-0 flex items-center space-x-2 bg-blue-600 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
        >
          <FiShoppingCart size={26} />
          <span className="text-lg font-semibold">Cart ({cart.length})</span>
        </Link>
      </div>

      {categories.map((category) => {
        const filteredItems = foodItems.filter((item) => categoryMapping[item.category_id] === category);
        return (
          <div key={category} className="mb-10">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 py-3 relative uppercase tracking-wide">
              {category}
              <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-[#3345A7] to-blue-400 transform -translate-x-1/2"></span>
            </h2>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.item_id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 w-56 h-75 mx-auto transform transition duration-300 hover:scale-105">
                    <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
                    <div className="p-3 text-center">
                      <h3 className="text-md font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center text-sm font-semibold text-gray-800 bg-gray-100 p-2 rounded-md">
                        <span>${item.price}</span>
                        <span>Quantity: {item.quantity}</span>
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="w-full mt-3 py-2 text-white font-medium rounded-lg bg-blue-500 hover:bg-blue-800 transition"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm italic">No items available in this category.</p>
            )}
          </div>
        );
      })}

      {selectedItem && (
        <OrderModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} />
      )}
    </div>
  );
};

export default OnlineOrderPage;