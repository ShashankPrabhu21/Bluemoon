"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdLocalOffer } from "react-icons/md";

interface FoodItem {
  item_id: number;
  name: string;
  image_url: string;
  quantity: number;
}

interface Offer {
  id: number;
  total_price: number | string | null;
  discounted_price: number | string | null;
  selected_items: string;
  offer_type: string;
}

const OffersCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // ✅ Added state to track hover

  const totalSlides = offers.length;

  useEffect(() => {
    const fetchOffersAndItems = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();

        if (!data || !Array.isArray(data.foodItems)) {
          console.error("Invalid data format:", data);
          setFoodItems([]);
          return;
        }

        setFoodItems(data.foodItems);
        setOffers(data.offers || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndItems();
  }, []);

  useEffect(() => {
    if (offers.length > 1 && !isHovered) { // ✅ Auto-slide only if not hovered
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [offers, isHovered]); // ✅ Dependency array updated with isHovered

  if (loading) return <p>Loading offers...</p>;
  if (offers.length === 0) return <p>No offers available.</p>;

  const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  const nextIndex = (currentIndex + 1) % totalSlides;

  const getSelectedItems = (offer: Offer) => {
    try {
      const itemIds = JSON.parse(offer.selected_items);
      return itemIds
        .map((id: number) => foodItems.find((item) => item.item_id === id))
        .filter(Boolean) as FoodItem[];
    } catch (error) {
      console.error("Error parsing selected_items:", error);
      return [];
    }
  };

  return (
    <div 
      className="relative w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-white to-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)} // ✅ Pause on hover
      onMouseLeave={() => setIsHovered(false)} // ✅ Resume on leave
    >
      <AnimatePresence>
        {/* Previous Slide */}
        <motion.div
          key={prevIndex}
          className="absolute left-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-6 opacity-70 border border-gray-700"
          initial={{ x: "-100vw" }}
          animate={{ x: "-25vw" }}
          exit={{ x: "-100vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-xl bg-yellow-500 px-4 py-2 rounded-md mb-4 mt-[-60px] w-[250px] text-center flex items-center justify-center gap-2 shadow-md">
            <MdLocalOffer className="text-white text-lg" /> 
            {offers[prevIndex].offer_type} Offer
          </h2>
          <div className="flex justify-center gap-6 mt-2">
            {getSelectedItems(offers[prevIndex]).map((item) => (
              <div key={item.item_id} className="text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <p className="mt-2 text-lg font-semibold">{item.name}</p>
                <div className="mt-1 text-sm font-medium text-gray-300 border border-orange-500 px-3 py-1 rounded-md inline-block">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-xl font-semibold">
            <p className="text-gray-400 line-through">Actual Price: ${offers[prevIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-2xl">Discounted Price: ${offers[prevIndex].discounted_price}</p>
          </div>
        </motion.div>

        {/* Center Slide - Enlarged */}
        <motion.div
          key={currentIndex}
          className="absolute w-[650px] h-[480px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-2xl p-8 scale-110 border border-gray-700"
          initial={{ x: "100vw" }}
          animate={{ x: "0vw" }}
          exit={{ x: "-25vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-5 py-3 rounded-xl mb-6 mt-[-40px] w-full text-center flex items-center justify-center gap-3 shadow-lg">
            <MdLocalOffer className="text-white text-3xl" /> 
            {offers[currentIndex].offer_type} Offer
          </h2>
          <div className="flex justify-center gap-8 mt-2">
            {getSelectedItems(offers[currentIndex]).map((item) => (
              <div key={item.item_id} className="text-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-400 shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                </div>
                <p className="mt-2 text-lg font-bold text-yellow-500">{item.name}</p>
                <div className="mt-1 text-sm font-medium text-gray-300 border border-orange-500 px-3 py-1 rounded-md inline-block">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-2xl font-semibold">
            <p className="text-gray-400 line-through">Actual Price: ${offers[currentIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-3xl">Discounted Price: ${offers[currentIndex].discounted_price}</p>
          </div>
        </motion.div>

        {/* Next Slide */}
        <motion.div
          key={nextIndex}
          className="absolute right-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-6 opacity-70 border border-gray-700"
          initial={{ x: "100vw" }}
          animate={{ x: "25vw" }}
          exit={{ x: "100vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg mb-4 mt-[-60px] w-[250px] text-center flex items-center justify-center gap-2 shadow-md">
            <MdLocalOffer className="text-white text-xl" /> {/* Premium offer icon */}
            {offers[nextIndex].offer_type} Offer
          </h2>
          <div className="flex justify-center gap-6 mt-2">
            {getSelectedItems(offers[nextIndex]).map((item) => (
              <div key={item.item_id} className="text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-500">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                <p className="mt-2 text-lg font-semibold">{item.name}</p>
                <div className="mt-1 text-sm font-medium text-gray-300 border border-yellow-500 px-3 py-1 rounded-md inline-block">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-xl font-semibold">
            <p className="text-gray-400 line-through">Actual Price: ${offers[nextIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-2xl">Discounted Price: ${offers[nextIndex].discounted_price}</p>
            </div>
</motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OffersCarousel;
