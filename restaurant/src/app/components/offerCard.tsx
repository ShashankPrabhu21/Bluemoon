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
  start_date: string;
  end_date: string;
}

const OffersCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
    if (offers.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % offers.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [offers, isHovered]);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>

        {/* Previous Slide */}
        <motion.div
          key={prevIndex}
          className="absolute left-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-6 opacity-70 border border-gray-700 hidden xl:flex"
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
            {/* 🗓️ Display Date Range for Previous Slide */}
            <p className="text-gray-400 text-sm mt-1">
              🗓️ {new Date(offers[prevIndex].start_date).toLocaleDateString()} -{" "}
              {new Date(offers[prevIndex].end_date).toLocaleDateString()}
            </p>
          </div>
        </motion.div>


        {/* Center Slide */}
        <motion.div
          key={currentIndex}
          className="relative w-[90%] max-w-[700px] md:max-w-[600px] sm:max-w-[450px]
                           min-h-[360px] lg:min-h-[500px] h-auto
                           bg-[#131722] text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-gray-700
                           flex flex-col items-center justify-between
                           mt-2 sm:mt-0 lg:mt-6 mb-2 sm:mb-0 lg:mb-6"
          initial={{ x: "100vw" }}
          animate={{ x: "0vw" }}
          exit={{ x: "-25vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Offer Header */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 text-white
                              px-6 py-3 sm:px-7 sm:py-4 rounded-lg flex items-center gap-3 w-full text-center justify-center shadow-lg">
            <MdLocalOffer className="text-white text-xl sm:text-2xl lg:text-3xl" />
            {offers[currentIndex].offer_type} Offer
          </h2>

          {/* Items Section */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12 mt-2 sm:mt-4 lg:mt-6 overflow-hidden">
            {getSelectedItems(offers[currentIndex]).map((item) => (
              <div key={item.item_id} className="text-center flex flex-col items-center w-[90px] sm:w-[120px] lg:w-[140px]">
                {/* Image Container */}
                <div className="relative w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 max-w-[80px] max-h-[80px] sm:max-w-none sm:max-h-none rounded-full overflow-hidden border-2 border-gray-500 shadow-md">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Item Name */}
                <p className="mt-1 sm:mt-2 text-xs sm:text-lg lg:text-lg font-bold text-yellow-400 leading-tight">
                  {item.name}
                </p>
                {/* Item Number */}
                <div className="mt-3  text-xs sm:text-sm lg:text-base font-medium text-gray-300 border border-gray-500 px-3 py-1 rounded-md">
                  Item No: {item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Price Section */}
          <div className="mt-4 sm:mt-6 text-center text-xl sm:text-2xl lg:text-2xl font-semibold">
            <p className="text-gray-400 line-through">Actual Price: ${offers[currentIndex].total_price}</p>
            <p className="text-yellow-300 font-bold text-2xl sm:text-3xl lg:text-3xl">
              Discounted Price: ${offers[currentIndex].discounted_price}
            </p>
            {/* 🗓️ Display Date Range for Center Slide */}
            <p className="text-gray-400 text-sm mt-1">
              🗓️ {new Date(offers[currentIndex].start_date).toLocaleDateString()} -{" "}
              {new Date(offers[currentIndex].end_date).toLocaleDateString()}
            </p>
          </div>
        </motion.div>


        {/* Next Slide */}
        <motion.div
          key={nextIndex}
          className="absolute right-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-xl p-6 opacity-70 border border-gray-700 hidden xl:flex"
          initial={{ x: "100vw" }}
          animate={{ x: "25vw" }}
          exit={{ x: "100vw" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg mb-4 mt-[-60px] w-[250px] text-center flex items-center justify-center gap-2 shadow-xl">
            <MdLocalOffer className="text-white text-xl" />
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
            {/* 🗓️ Display Date Range for Next Slide */}
            <p className="text-gray-400 text-sm mt-1">
              🗓️ {new Date(offers[nextIndex].start_date).toLocaleDateString()} -{" "}
              {new Date(offers[nextIndex].end_date).toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OffersCarousel;