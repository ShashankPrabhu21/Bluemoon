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
    <div className="min-h-screen bg-white p-6 mt-32">

  <div className="relative mb-10 px-4 sm:px-8">
  {/* Cart Button */}
  <div className="flex justify-center lg:justify-end lg:absolute lg:top-0 lg:right-0 w-full">
    <Link
      href="/cart"
      className="mb-4 lg:mb-0 flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
    >
      <FiShoppingCart size={22} className="sm:size-[26px]" />
      <span className="text-base sm:text-lg font-semibold">Cart ({cart.length})</span>
    </Link>
  </div>

  {/* Heading */}
  <h1 className="text-5xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-wide bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text drop-shadow-lg text-center">
    Online Order
  </h1>
</div>




      {/* Service Type Selection */}
      <div className="flex justify-center items-center mb-6">
  <span className="mr-4 text-xl font-semibold text-gray-900">Select Service Type:</span>
  <div className="flex bg-gray-200 p-1 rounded-full shadow-lg border border-gray-300">
    <button
      onClick={() => setServiceType("pickup")}
      className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out 
        ${serviceType === "pickup"
          ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white shadow-xl transform scale-105"
          : "bg-transparent text-gray-700 hover:text-blue-500"
        }`}
    >
      Pickup
    </button>
    <button
      onClick={() => setServiceType("delivery")}
      className={`px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out 
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
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-900 py-3 relative uppercase tracking-wide">
              {category}
              <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-[#3345A7] to-blue-400 transform -translate-x-1/2"></span>
            </h2>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.item_id} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 w-56 h-75 mx-auto transform transition duration-300 hover:scale-105">
                    <img
                      src={item.image_url || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3 text-center">
                      <h3 className="text-md font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center text-sm font-semibold text-gray-800 bg-gray-100 p-2 rounded-md">
                        <span>${item.price}</span>
                        <span>Item: {item.quantity}</span>
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
        <OrderModal item={selectedItem} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} serviceType={serviceType}/>
      )}
    </div>
  );
};

export default OnlineOrderPage;