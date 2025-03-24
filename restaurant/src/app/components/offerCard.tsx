"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface FoodItem {
  item_id: number;
  name: string;
  image_url: string;
}

interface Offer {
  id: number;
  total_price: number | string | null;
  discounted_price: number | string | null;
  selected_items: string;
}

const OffersCarousel = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffersAndItems = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();

        console.log("Fetched Offers:", JSON.stringify(data, null, 2));

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

  if (loading) return <p>Loading offers...</p>;
  if (offers.length === 0) return <p>No offers available.</p>;

  return (
    <div className="w-full p-4 bg-gray-100 flex justify-center">
      <div className="max-w-[800px] w-full overflow-hidden mx-auto">
        <h2 className="text-center text-xl font-bold bg-yellow-500 text-white p-2">
          Daily Offers
        </h2>

        <div className="flex space-x-6 mt-4 overflow-hidden">
          {offers.map((offer, index) => {
            let selectedItems: FoodItem[] = [];

            try {
              const itemIds = JSON.parse(offer.selected_items);
              selectedItems = itemIds
                .map((id: number) =>
                  foodItems.find((item) => item.item_id === id)
                )
                .filter(Boolean) as FoodItem[];
            } catch (error) {
              console.error("Error parsing selected_items:", error);
            }

            const totalPrice = Number(offer.total_price) || 0;
            const discountedPrice = Number(offer.discounted_price) || 0;

            return (
              <motion.div
                key={offer.id}
                className="w-60 bg-white shadow-md p-4 rounded-lg"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{
                  delay: index * 2, // Moves one after another (2s delay per item)
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <p className="text-red-600 line-through text-lg">
                  Total Price: ${totalPrice.toFixed(2)}
                </p>
                <p className="text-green-600 text-lg font-bold">
                  Discounted Price: ${discountedPrice.toFixed(2)}
                </p>

                <div className="flex space-x-4 mt-3">
                  {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                      <div key={item.item_id} className="text-center">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <p className="mt-1 text-sm">{item.name}</p>
                      </div>
                    ))
                  ) : (
                    <p>No items available</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OffersCarousel;
