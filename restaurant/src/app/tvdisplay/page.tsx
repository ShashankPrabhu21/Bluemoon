"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const categoryOrder = ["Breakfast", "Main Course", "Entree", "Drinks"];

  // Memoized fetch function with timeout and retry logic
  const fetchMenuItems = useCallback(async (retryCount = 0) => {
    const maxRetries = 3;
    const timeout = 10000; // 10 seconds timeout

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const res = await fetch("/api/menuitem?no_pagination=true", {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data: FoodItem[] = await res.json();

      // Group items by category
      const grouped: { [key: string]: FoodItem[] } = {};
      data.forEach((item) => {
        if (item.category_name) {
          if (!grouped[item.category_name]) grouped[item.category_name] = [];
          grouped[item.category_name].push(item);
        }
      });

      setFoodItemsByCategory(grouped);
      setError(null);
      setIsLoading(false);

    } catch (err: unknown) {
      console.error(`Fetch attempt ${retryCount + 1} failed:`, err);
      
      if (retryCount < maxRetries) {
        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => fetchMenuItems(retryCount + 1), delay);
      } else {
        const errorMessage = err instanceof Error ? err.message : "Network error - please check connection";
        setError(errorMessage);
        setIsLoading(false);
      }
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Optimized scroll animation with better performance
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isLoading || error || Object.keys(foodItemsByCategory).length === 0) {
      return;
    }

    // Clear any existing animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Delay scroll start to allow images to load
    scrollTimeoutRef.current = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 300000; // 5 minutes
      const targetScroll = container.scrollHeight - container.clientHeight;

      if (targetScroll <= 0) return;

      const scrollStep = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        container.scrollTop = progress * targetScroll;

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(scrollStep);
        } else {
          // Reset and start over
          container.scrollTop = 0;
          startTime = null;
          animationFrameRef.current = requestAnimationFrame(scrollStep);
        }
      };

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    }, 2000); // Wait 2 seconds before starting scroll

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [foodItemsByCategory, error, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
        <TVNavbar />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-solid mx-auto mb-4"></div>
          <p className="text-white text-3xl font-bold">Loading Menu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
        <TVNavbar />
        <div className="relative z-10 text-center">
          <p className="text-red-400 text-2xl font-bold mb-4">⚠️ {error}</p>
          <button 
            onClick={() => {
              setIsLoading(true);
              setError(null);
              fetchMenuItems();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            style={{ objectFit: "cover" }}
                            className="group-hover:scale-110 transition-transform duration-300"
                            priority={false}
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAQIAEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Wque2nLVwm7Hp7cWG3M4QLrBM6XEJwUFsAE8DgBgdAbT3RCxJz5j4RCSF0UEbUcnJTEu5rqr35kYdGb2w/rLNKBBAAAG/bE8T1zxe+5kXTPk0/9k="
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