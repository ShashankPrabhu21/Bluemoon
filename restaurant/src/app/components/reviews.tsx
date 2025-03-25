"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: number;
  name: string;
  rating: number;
  experience: string;
  created_at: string;
  gender?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for previous

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [reviews, currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };


  const prevIndex = (currentIndex - 1 + reviews.length) % reviews.length;
  const nextIndex = (currentIndex + 1) % reviews.length;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <h2 className="text-4xl font-bold mb-8 text-[#2A4D80] text-center">
        ⭐ CUSTOMER REVIEWS ⭐
      </h2>

      {reviews.length > 0 ? (
        <div className="relative w-full mx-auto overflow-hidden h-[500px] flex items-center justify-center">
          <AnimatePresence custom={direction} mode="popLayout">
            {/* Previous Review */}
            <motion.div
              key={prevIndex}
              className="absolute left-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 shadow-lg rounded-xl p-6 opacity-70 border border-gray-200"
              initial={{ x: "-100vw" }}
              animate={{ x: "-25vw" }}
              exit={{ x: "-100vw" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={
                  reviews[prevIndex].gender?.toLowerCase() === "male"
                    ? "/male.png"
                    : "/female.png"
                }
                alt="Gender Icon"
                className="w-20 h-20 object-contain mb-4 rounded-full shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">{reviews[prevIndex].name}</h3>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: reviews[prevIndex].rating }).map((_, index) => (
                  <span key={index} className="text-yellow-400 text-3xl">⭐</span>
                ))}
              </div>
              <p className="italic text-gray-700 mt-3 text-lg">{reviews[prevIndex].experience}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(reviews[prevIndex].created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>

            {/* Current Review - Enlarged */}
            <motion.div
              key={currentIndex}
              className="absolute w-[650px] h-[450px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 shadow-xl rounded-2xl p-8 scale-110 border border-gray-300"
              initial={{ x: "100vw" }}
              animate={{ x: "0vw" }}
              exit={{ x: direction > 0 ? "-25vw" : "25vw" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={
                  reviews[currentIndex].gender?.toLowerCase() === "male"
                    ? "/male.png"
                    : "/female.png"
                }
                alt="Gender Icon"
                className="w-24 h-24 object-contain mb-6 rounded-full shadow-md"
              />
              <h3 className="text-2xl font-semibold text-gray-800">{reviews[currentIndex].name}</h3>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: reviews[currentIndex].rating }).map((_, index) => (
                  <span key={index} className="text-yellow-400 text-3xl">⭐</span>
                ))}
              </div>
              <p className="italic text-gray-700 mt-3 text-lg">{reviews[currentIndex].experience}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(reviews[currentIndex].created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>

            {/* Next Review */}
            <motion.div
              key={nextIndex}
              className="absolute right-[15%] w-[400px] h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800 shadow-lg rounded-xl p-6 opacity-70 border border-gray-200"
              initial={{ x: "100vw" }}
              animate={{ x: "25vw" }}
              exit={{ x: "100vw" }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <img
                src={
                  reviews[nextIndex].gender?.toLowerCase() === "male"
                    ? "/male.png"
                    : "/female.png"
                }
                alt="Gender Icon"
                className="w-20 h-20 object-contain mb-4 rounded-full shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">{reviews[nextIndex].name}</h3>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: reviews[nextIndex].rating }).map((_, index) => (
                  <span key={index} className="text-yellow-400 text-3xl">⭐</span>
                ))}
              </div>
              <p className="italic text-gray-700 mt-3 text-lg">{reviews[nextIndex].experience}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(reviews[nextIndex].created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No reviews yet. Be the first to leave one!</p>
      )}
    </div>
  );
}