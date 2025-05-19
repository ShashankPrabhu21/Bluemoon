"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
// Removed Link, motion, Fa-icons, Lucide-icons as they are no longer used
import TVNavbar from "../components/TVNavbar"; // Assuming TVNavbar is still desired

// Interface for FoodItem remains as it's used by the FoodItems section
interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spicy_level: string;
  quantity: number;
  category_name?: string;
}

// The main component (renamed for clarity, though original was HeroSection)
const FoodDisplayPage = () => {
  // State for food items, keeping only what's necessary for the FoodItems section
  const [foodItemsByCategory, setFoodItemsByCategory] = useState<{ [key: string]: FoodItem[] }>({});
  const foodItemsContainerRef = useRef<HTMLDivElement>(null);

  // Defines the order of categories in the FoodItems section
  const categoryOrder = ["Breakfast", "Main Course", "Snacks", "Drinks", "Desserts"];

  // Fetches menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data: FoodItem[] = await res.json();

        const grouped: { [key: string]: FoodItem[] } = {};
        data.forEach((item) => {
          if (item.category_name) {
            if (!grouped[item.category_name]) {
              grouped[item.category_name] = [];
            }
            grouped[item.category_name].push(item);
          }
        });
        setFoodItemsByCategory(grouped);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  // useEffect for continuously scrolling the FoodItems section
  useEffect(() => {
    // This effect runs when foodItemsByCategory data is available and the container ref is set.
    if (Object.keys(foodItemsByCategory).length > 0 && foodItemsContainerRef.current) {
      const container = foodItemsContainerRef.current;
      let animationFrameId: number | null = null;
      let startTime: number | null = null;
      const duration = 300000; // Scrolling speed as requested

      const scroll = (timestamp: number) => {
        if (!container) return; // Exit if container is not available

        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        let progress = elapsed / duration;

        // Ensure progress doesn't exceed 1, but allow it to be slightly over to detect loop completion
        // container.scrollHeight can change if images load late, recalculate target scroll
        const targetScroll = container.scrollHeight - container.clientHeight;
        
        if (targetScroll <= 0) { // Nothing to scroll or content not fully loaded
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(scroll); // Keep trying if no scroll height yet
            return;
        }

        container.scrollTop = Math.min(progress * targetScroll, targetScroll);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(scroll);
        } else {
          // Loop: Reset and restart scrolling
          container.scrollTop = 0;
          startTime = null; // Reset startTime to restart progress calculation
          if (animationFrameId) cancelAnimationFrame(animationFrameId); // Cancel previous frame
          animationFrameId = requestAnimationFrame(scroll); // Start new animation frame
        }
      };
      
      // Clear any previous animation frame and start a new one
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      startTime = null; // Reset startTime for a fresh start
      animationFrameId = requestAnimationFrame(scroll);


      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [foodItemsByCategory]); // Re-run if food items change

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
      <TVNavbar />

      {/* FOOD ITEMS SECTION - This is the only section displayed */}
      <section className="relative py-24 mt-12 overflow-hidden bg-[url('/sec11.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90 z-0"></div>
        <div className="relative container mx-auto px-4 z-10">
          <div
            className="flex flex-col gap-8 overflow-y-auto max-h-[75vh]" // `overflow-y-auto` allows programmatic scrolling
            ref={foodItemsContainerRef}
            style={{ scrollBehavior: 'auto' }} // Ensure programmatic scroll is smooth if needed, or 'auto' for instant jumps
          >
            {categoryOrder.map((categoryName) =>
              foodItemsByCategory[categoryName] &&
              foodItemsByCategory[categoryName].length > 0 && (
                <div key={categoryName}>
                  <div className="relative flex justify-center mt-12">
                    <h2 className="relative inline-block text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d2d7ef] via-[#cad1f6] to-[#cbd2f4] tracking-wider mb-8 drop-shadow-[0_4px_10px_rgba(74,96,210,0.35)] after:content-[''] after:block after:h-[4px] after:w-20 after:mx-auto after:mt-3 after:bg-gradient-to-r after:from-[#2C3E91] after:to-[#4A60D2] after:rounded-full">
                      {categoryName}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {foodItemsByCategory[categoryName].map((item) => (
                      <div
                        key={item.item_id}
                        className="relative h-60 rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <Image
                          src={item.image_url || "/placeholder.jpg"}
                          alt={item.name}
                          layout="fill"
                          objectFit="cover"
                          className="group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-lg md:text-xl font-extrabold text-white drop-shadow-sm">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-200 drop-shadow-sm">Token: {item.quantity}</p>
                          <p className="text-xl font-bold text-yellow-400 drop-shadow-sm">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodDisplayPage;