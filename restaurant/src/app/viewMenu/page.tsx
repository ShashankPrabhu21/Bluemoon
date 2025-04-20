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
  spicy_level: string;
  quantity: number;
}

interface CartItem {
  cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  item_id: number;
  user_id: number;
  service_type: string; // Added service_type
}

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  3: "Desserts",
  4: "Snacks",
  5: "Drinks",
};

const categories = Object.values(categoryMapping);

const OnlineOrderPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceType, setServiceType] = useState<string>("delivery"); // Default service type

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

    const fetchCartItems = async () => {
      try {
        const res = await fetch("/api/cart/get");
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const clearCart = async () => {
      try {
        await fetch("/api/cart/clear", {
          method: "POST",
        });
        setCart([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    };

    const handleCartLogic = async () => {
      fetchMenuItems();

      if (sessionStorage.getItem("fromCart") === "true") {
        await fetchCartItems();
        sessionStorage.removeItem("fromCart"); // Clear the flag after fetching
      } else {
        await clearCart(); // Clear cart unless coming from cart page.
      }
      await fetchCartItems(); // Fetch cart in any case.
    };

    handleCartLogic();
  }, []);

  const addToCart = async (item: FoodItem, quantity: number, specialNote: string) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item.item_id,
          quantity: quantity,
          special_note: specialNote,
          service_type: serviceType, // Include service type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add to cart: ${response.status} - ${response.statusText} - ${JSON.stringify(errorData)}`);
      }
      const cartData = await (await fetch("/api/cart/get")).json();
      setCart(cartData);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen py-6 bg-[url('/sec1.jpg')] bg-cover bg-center bg-no-repeat relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black opacity-90"></div>
        <div className="z-10 relative mb-10 px-4 sm:px-8 mt-32">
        {/* Cart Button */}
        <div className="flex justify-center lg:justify-end lg:absolute lg:top-0 lg:right-2 w-full z-50">
          <Link
            href="/cart"
            className="mb-4 lg:mb-0 flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            <FiShoppingCart size={22} className="sm:size-[26px]" />
            <span className="text-base sm:text-lg font-semibold">Cart ({cart.length})</span>
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-wide bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text drop-shadow-lg text-center">
          Online Order
        </h1>
      </div>

      {/* Service Type Selection */}
      <div className="z-10 flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6 text-center">
        <span className="text-lg sm:text-xl font-semibold z-10 text-white">
          Select Service Type:
        </span>
        
        <div className="flex bg-gray-200 p-1 rounded-full shadow-lg border border-gray-300 z-10">
          <button
            onClick={() => setServiceType("pickup")}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out
              ${serviceType === "pickup"
                ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white shadow-xl transform scale-105"
                : "bg-transparent text-gray-700 hover:text-blue-500"
              }`}
          >
            Pickup
          </button>
          
          <button
            onClick={() => setServiceType("delivery")}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out
              ${serviceType === "delivery"
                ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white shadow-xl transform scale-105"
                : "bg-transparent text-gray-700 hover:text-blue-500"
              }`}
          >
            Delivery
          </button>
        </div>
      </div>

    {categories.map((category) => {
      const filteredItems = foodItems.filter((item) => categoryMapping[item.category_id] === category);
      return (
      <div key={category} className="mb-10">
        <h2 className="mb-6 text-3xl font-bold text-center text-white py-3 relative uppercase tracking-wide">
          {category}
          <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-[#3345A7] to-blue-400 transform -translate-x-1/2"></span>
        </h2>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4">
          {filteredItems.map((item) => (
          <div
          key={item.item_id}
          className="z-10 group bg-white/90 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300 ease-in-out rounded-2xl overflow-hidden hover:bg-[#b7cbf9] text-sm sm:text-base"
 >
              <img
                  src={item.image_url || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-32 sm:h-48 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-110"
              />

        <div className="p-2 sm:p-3 text-center rounded-b-xl">
        <h3 className="text-sm sm:text-lg font-bold text-blue-900 tracking-wide truncate">{item.name}</h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md mb-2 sm:mb-4">
            <span className="text-blue-800 font-semibold">${item.price}</span>
            <span className="text-gray-500">Item No: {item.quantity}</span>
        </div>

          <button
            onClick={() => setSelectedItem(item)}
            className="w-full py-2 sm:py-2.5 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
            Order Now
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p className="text-center text-gray-500">No items found</p>
)}
          </div>
        );
      })}

{selectedItem && (
        <OrderModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} serviceType={serviceType}/>
      )}
    </div>
  );
};

export default OnlineOrderPage;