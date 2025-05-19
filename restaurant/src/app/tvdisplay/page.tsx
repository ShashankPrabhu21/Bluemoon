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

// The main component
const FoodDisplayPage = () => {
  // State for food items, keeping only what's necessary for the FoodItems section
  const [foodItemsByCategory, setFoodItemsByCategory] = useState<{ [key: string]: FoodItem[] }>({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state
  const foodItemsContainerRef = useRef<HTMLDivElement>(null);

  // Defines the order of categories in the FoodItems section
  const categoryOrder = ["Breakfast", "Main Course", "Snacks", "Drinks", "Desserts"];

  // Fetches menu items when the component mounts
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true); // Start loading
      setError(null); // Clear previous errors
      try {
        console.log("Fetching menu items...");
        const startTime = performance.now(); // Start timing fetch
        const res = await fetch("/api/menuitem");
        const endTime = performance.now(); // End timing fetch
        console.log(`Workspace completed in ${endTime - startTime} ms`);

        if (!res.ok) {
          // Log response status and body for debugging
          const errorBody = await res.text();
          console.error(`Failed to fetch menu items: ${res.status} ${res.statusText}`, errorBody);
          throw new Error(`Failed to fetch menu items: ${res.status} ${res.statusText}`);
        }
        const data: FoodItem[] = await res.json();
        console.log(`Received ${data.length} menu items.`);

        const grouped: { [key: string]: FoodItem[] } = {};
        data.forEach((item) => {
          // Ensure item.category_name is a string and not null/undefined
          if (item.category_name && typeof item.category_name === 'string') {
            if (!grouped[item.category_name]) {
              grouped[item.category_name] = [];
            }
            grouped[item.category_name].push(item);
          } else {
             console.warn(`Item ${item.item_id} is missing category_name or it's not a string.`);
          }
        });
        setFoodItemsByCategory(grouped);
      } catch (error: unknown) { // Catch as unknown for type safety
        console.error("Error fetching menu items:", error);
        // Safely check the type and access the message
        if (error instanceof Error) {
           setError(`Failed to load menu items: ${error.message}`);
        } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
           // Fallback for errors that are not standard Error instances but have a message
           setError(`Failed to load menu items: ${(error as any).message}`);
        }
         else {
           setError("An unknown error occurred while loading menu items.");
        }
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchMenuItems();
  }, []);

  // useEffect for continuously scrolling the FoodItems section
  // This effect depends on the container ref and the loaded food items
  useEffect(() => {
    // Don't start scrolling if container not ready, still loading, or errored, or no items
    if (!foodItemsContainerRef.current || isLoading || error || Object.keys(foodItemsByCategory).length === 0) {
       return;
    }

    const container = foodItemsContainerRef.current;
    let animationFrameId: number | null = null;
    let startTime: number | null = null;
    // Reduced scroll duration significantly (e.g., 60 seconds).
    // Adjust this value (in milliseconds) to control scroll speed.
    // 300000 ms is 5 minutes, which is extremely slow for a display board.
    const duration = 60000; // Example: 60 seconds (1 minute) for a full scroll

    const scroll = (timestamp: number) => {
      // Recalculate target scroll height inside the loop
      // This accounts for images loading and changing scrollHeight over time
      const targetScroll = container.scrollHeight - container.clientHeight;

      // Only attempt to scroll if there's something to scroll
      if (targetScroll <= 0) {
         // If scrollHeight isn't > clientHeight yet, wait for content/images to load
         animationFrameId = requestAnimationFrame(scroll);
         return;
      }

      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Use modulo for continuous looping based on elapsed time
      // The position cycles between 0 and targetScroll based on elapsed time and duration
      const position = (elapsed % duration) / duration * targetScroll;


      container.scrollTop = position;

      animationFrameId = requestAnimationFrame(scroll);
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
    // Re-run if food items change or loading/error states change
  }, [foodItemsByCategory, isLoading, error]); // Added isLoading, error dependencies

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
      <TVNavbar />

      {/* FOOD ITEMS SECTION */}
      {/* Adjusted padding-top to prevent content from being hidden under navbar */}
      <section className="relative pt-32 pb-12 overflow-hidden bg-[url('/sec11.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90 z-0"></div>
        <div className="relative container mx-auto px-4 z-10">
          {/* Loading/Error State Display */}
          {isLoading && (
              <div className="text-center text-white text-2xl mt-20">Loading menu items...</div>
          )}
          {error && (
              <div className="text-center text-red-500 text-2xl mt-20">Error: {error}</div>
          )}

          {/* Food Items Container - Only show if not loading and no error */}
          {!isLoading && !error && Object.keys(foodItemsByCategory).length > 0 && (
             <div
               className="flex flex-col gap-8 overflow-y-auto max-h-[75vh]" // `overflow-y-auto` allows programmatic scrolling
               ref={foodItemsContainerRef}
               // scrollBehavior: 'auto' for instant jumps, 'smooth' if you prefer animation between scrolls
               style={{ scrollBehavior: 'auto' }}
             >
               {/* Map through categories based on the defined order */}
               {categoryOrder.map((categoryName) =>
                 // Only render if the category exists and has items
                 foodItemsByCategory[categoryName] &&
                 foodItemsByCategory[categoryName].length > 0 && (
                   <div key={categoryName}>
                     <div className="relative flex justify-center mt-12">
                       <h2 className="relative inline-block text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#d2d7ef] via-[#cad1f6] to-[#cbd2f4] tracking-wider mb-8 drop-shadow-[0_4px_10px_rgba(74,96,210,0.35)] after:content-[''] after:block after:h-[4px] after:w-20 after:mx-auto after:mt-3 after:bg-gradient-to-r after:from-[#2C3E91] after:to-[#4A60D2] after:rounded-full">
                         {categoryName}
                       </h2>
                     </div>

                     {/* Grid layout for items */}
                     <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
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
                             // *** ADDED sizes PROP HERE ***
                             // This tells Next.js how wide the image will be at different breakpoints,
                             // allowing it to select the optimal image size from the generated srcset.
                             sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 20vw"
                             // loading="lazy" is the default, so you don't strictly need to add it,
                             // but you can if you want to be explicit.
                             // loading="lazy"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent flex flex-col justify-end p-4">
                             <h3 className="text-lg md:text-xl font-extrabold text-white drop-shadow-sm">
                               {item.name}
                             </h3>
                             {/* Ensure item.quantity exists before displaying */}
                             {item.quantity !== undefined && item.quantity !== null && (
                               <p className="text-sm text-gray-200 drop-shadow-sm">Token: {item.quantity}</p>
                             )}
                              {/* Ensure item.price exists before displaying */}
                             {item.price !== undefined && item.price !== null && (
                               <p className="text-xl font-bold text-yellow-400 drop-shadow-sm">${item.price}</p>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )
               )}
             </div>
           )}
           {/* Message if no items are found after loading */}
            {!isLoading && !error && Object.keys(foodItemsByCategory).length === 0 && (
               <div className="text-center text-white text-2xl mt-20">No menu items available.</div>
            )}
        </div>
      </section>
    </div>
  );
};

export default FoodDisplayPage;