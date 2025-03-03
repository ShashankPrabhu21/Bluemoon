"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "John Doe",
    image: "/r1.png",
    review:
      "Absolutely loved the authentic Kerala flavors! The seafood dishes were fresh, aromatic, and bursting with taste. Every bite took me straight to Kerala, especially the prawn curry—it was divine!",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "/r2.png",
    review:
      "The best Kerala restaurant in Australia! The spices were perfectly blended, and the appam with stew was heavenly. The service was exceptional, and the ambiance made the experience even better.",
  },
  {
    id: 3,
    name: "Emily Johnson",
    image: "/r3.png",
    review:
      "Bluemoon Restaurant is a hidden gem! The Malabar biryani was outstanding—flavorful, aromatic, and cooked to perfection. The balance of spices was impeccable, and the raita complemented it beautifully.",
  },
  {
    id: 4,
    name: "Michael Brown",
    image: "/r4.png",
    review:
      "A true taste of Kerala! The coconut-infused curries reminded me of home. The seafood platter was fresh and bursting with flavors, and the mango lassi was the perfect refreshing drink.",
  },
  {
    id: 5,
    name: "Juliet Wilson",
    image: "/r5.png",
    review:
      "Incredible experience! The flavors transported me straight to Kerala. The parotta was soft and flaky, and the beef fry had just the right amount of spice. Highly recommend their seafood platters!",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextReview();
    }, 6000); // Auto-switch every 6 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white bg-opacity-90">
      <h2 className="text-4xl font-bold mb-8 text-[#2A4D80] text-center">
        ⭐ CUSTOMER REVIEWS ⭐
      </h2>

      <div className="relative flex flex-col items-center w-full max-w-3xl bg-gradient-to-br from-[#5e88b3] to-[#3345A7] rounded-3xl shadow-lg p-8 text-white">
        {/* Reviewer Image */}
        <motion.div
          key={reviews[currentIndex].id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md"
        >
          <Image
            src={reviews[currentIndex].image}
            alt={reviews[currentIndex].name}
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </motion.div>

        {/* Review Text */}
        <motion.div
          key={reviews[currentIndex].review}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="mt-6 text-center text-lg italic px-6 leading-relaxed"
        >
          "{reviews[currentIndex].review}"
        </motion.div>

        {/* Reviewer Name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-4 font-semibold text-lg"
        >
          - {reviews[currentIndex].name}
        </motion.p>

        {/* Navigation Arrows */}
        <div className="flex items-center mt-6 space-x-4">
          <button
            onClick={prevReview}
            className="p-3 bg-white bg-opacity-25 text-white rounded-full shadow-md hover:bg-opacity-40 transition"
          >
            <FaArrowLeft size={20} />
          </button>
          <button
            onClick={nextReview}
            className="p-3 bg-white bg-opacity-25 text-white rounded-full shadow-md hover:bg-opacity-40 transition"
          >
            <FaArrowRight size={20} />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex mt-6 space-x-2">
          {reviews.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
