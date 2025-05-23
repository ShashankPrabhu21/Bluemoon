"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import TVNavbar from "../components/TVNavbar";

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

const FoodDisplayPage = () => {
  const [foodItemsByCategory, setFoodItemsByCategory] = useState<{ [key: string]: FoodItem[] }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const categoryOrder = ["Breakfast", "Main Course", "Snacks", "Drinks", "Desserts"];

  // Fetch food items once
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data: FoodItem[] = await res.json();

        const grouped: { [key: string]: FoodItem[] } = {};
        data.forEach((item) => {
          if (item.category_name) {
            if (!grouped[item.category_name]) grouped[item.category_name] = [];
            grouped[item.category_name].push(item);
          }
        });

        setFoodItemsByCategory(grouped);
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };

    fetchMenuItems();
  }, []);

  // Slow infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 30000; // 5 minutes

    const scrollStep = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const targetScroll = container.scrollHeight - container.clientHeight;
      if (targetScroll <= 0) {
        // Wait a bit, then try again (content might not be fully rendered)
        animationFrameId = requestAnimationFrame(scrollStep);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      container.scrollTop = progress * targetScroll;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(scrollStep);
      } else {
        // Reset scroll and start over
        container.scrollTop = 0;
        startTime = null;
        animationFrameId = requestAnimationFrame(scrollStep);
      }
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [foodItemsByCategory]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
      <TVNavbar />

      <section className="relative py-24 mt-12 overflow-hidden bg-[url('/sec11.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90 z-0" />
        <div className="relative container mx-auto px-4 z-10">
          <div
            ref={containerRef}
            className="flex flex-col gap-8 overflow-y-auto max-h-[75vh]"
            style={{ scrollBehavior: "auto" }}
          >
            {categoryOrder.map(
              (categoryName) =>
                foodItemsByCategory[categoryName]?.length > 0 && (
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
                            fill
                            style={{ objectFit: "cover" }}
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
