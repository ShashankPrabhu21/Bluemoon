// viewScheduleMenu.tsx
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
    3: "Desserts",
    4: "Snacks",
    5: "Drinks",
};

const categories = Object.values(categoryMapping);

const ViewScheduleMenuPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
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
    const [isFromCart, setIsFromCart] = useState(false);

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

        if (!fromCart) {
            clearScheduledCart();
        }

        setIsFromCart(!!fromCart);
        fetchMenuItems();
        fetchCartItems();
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

    return (
        <div className="min-h-screen bg-white p-6 mt-32">
            <div className="flex justify-center flex-col items-center relative mb-10">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide">Scheduled Order</h1>
                <div className="mt-6 text-center space-y-2 bg-gray-100 p-4 rounded-lg shadow-md">
                  <p className="text-xl font-bold text-gray-800">Service: <span className="text-blue-600">{service}</span></p>
                  <p className="text-lg text-gray-700">📅 Date: <span className="font-medium">{date}</span></p>
                  <p className="text-lg text-gray-700">⏰ Time: <span className="font-medium">{time}</span></p>
                </div>

                <Link
                    href={{
                        pathname: "/scheduledCart",
                        query: {
                            service: service || "",
                            date: date || "",
                            time: time || "",
                        },
                    }}
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