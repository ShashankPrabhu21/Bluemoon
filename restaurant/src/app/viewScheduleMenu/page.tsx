"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FiShoppingCart } from "react-icons/fi";
import ScheduleOrderModal from "../components/ScheduleOrderModal";
import { useSearchParams } from 'next/navigation';
import Link from "next/link";

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
  scheduled_cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  item_id: number;
  user_id: number;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
}

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",

  4: "Entree",
  5: "Drinks",
};

const categories = Object.values(categoryMapping);

const ViewScheduleMenuPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-gray-100"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div><span className="ml-3 text-blue-500 font-semibold">Loading...</span></div>}>
      <ViewScheduleMenuContent />
    </Suspense>
  );
};

const ViewScheduleMenuContent = () => {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [, setIsFromCart] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

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
        const res = await fetch("/api/scheduledcart/get");
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
        }
      } catch (error) {
        console.error("Error fetching scheduled cart:", error);
      }
    };

    const clearScheduledCart = async () => {
      try {
        const response = await fetch('/api/scheduledcart/clear', {
          method: 'POST',
        });
        if (response.ok) {
          setCart([]); // Clear local cart state
        } else {
          console.error('Failed to clear scheduled cart');
        }
      } catch (error) {
        console.error('Error clearing scheduled cart:', error);
      }
    };

    const searchParams = new URLSearchParams(window.location.search);
    const fromCart = searchParams.get('fromCart');

    const fetchData = async () => {
      setLoading(true);
      await fetchMenuItems();
      if (!fromCart) {
        await clearScheduledCart();
      }
      setIsFromCart(!!fromCart);
      await fetchCartItems();
      setLoading(false);
    };

    fetchData();
  }, []);

  const addToCart = async (item: FoodItem, quantity: number, specialNote: string) => {
    try {
      const response = await fetch('/api/scheduledcart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: item.item_id,
          quantity: quantity,
          special_note: specialNote,
          scheduledDate: date,
          scheduledTime: time,
          serviceType: service,
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to add to scheduled cart: ${response.status} - ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage += ` - ${JSON.stringify(errorData)}`;
        } catch {
          errorMessage += ` - Could not parse error response`;
        }
        throw new Error(errorMessage);
      }

      const cartData = await (await fetch('/api/scheduledcart/get')).json();
      setCart(cartData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error adding to scheduled cart:', error.message);
        alert(error.message);
      } else {
        console.error('An unknown error occurred:', error);
        alert('An unknown error occurred.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-semibold">Loading menu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 bg-[url('/sec1.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black opacity-90"></div>
      <div className="relative z-10 mb-10 px-4 sm:px-8 mt-32">
        {/* Cart Button */}
        <div className="flex justify-center lg:justify-end lg:absolute lg:top-0 lg:right-2 w-full">
          <Link
            href={{
              pathname: "/scheduledCart",
              query: {
                service: service || "",
                date: date || "",
                time: time || "",
              },
            }}
            className="mb-4 lg:mb-0 flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            <FiShoppingCart size={22} className="sm:size-[26px]" />
            <span className="text-base sm:text-lg font-semibold">Cart ({cart.length})</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="flex flex-col justify-center items-center ">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wide text-center">
            Scheduled Order
          </h1>

          <div className="mt-6 text-center space-y-2 bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="text-xl font-bold text-gray-800">
              Service: <span className="text-blue-600">{service}</span>
            </p>
            <p className="text-lg text-gray-700">
              📅 Date: <span className="font-medium">{date}</span>
            </p>
            <p className="text-lg text-gray-700">
              ⏰ Time: <span className="font-medium">{time}</span>
            </p>
          </div>
        </div>
      </div>

      {categories.map((category) => {
        const filteredItems = foodItems.filter((item) => categoryMapping[item.category_id] === category);
        return (
          <div key={category} className="mb-10">
            <h2 className="z-10 mb-6 text-3xl font-bold text-center text-white py-3 relative uppercase tracking-wide">
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
                    <div className="p-2 sm:p-3 text-center  rounded-b-xl">
                      <h3 className="text-sm sm:text-lg font-bold text-blue-900 tracking-wide truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md mb-2 sm:mb-4">
                        <span className="text-blue-800 font-semibold">${item.price}</span>
                        <span className="text-gray-500">Item No: {item.quantity}</span>
                      </div>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="w-full py-2 sm:py-2.5 text-white font-semibold rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-200 transform active:scale-95"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm italic">No items found</p>
            )}
          </div>
        );
      })}

      {selectedItem && (
        <ScheduleOrderModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
          scheduledDate={date || ""}
          scheduledTime={time || ""}
          serviceType={service || ""}
        />
      )}
    </div>
  );
};

export default ViewScheduleMenuPage;