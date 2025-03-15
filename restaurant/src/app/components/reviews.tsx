"use client";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  gender?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for previous

  useEffect(() => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 1900);

      return () => clearInterval(interval);
    }
  }, [reviews, currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white bg-opacity-90 w-full ">
      <h2 className="text-4xl font-bold mb-8 text-[#2A4D80] text-center">
        ⭐ CUSTOMER REVIEWS ⭐
      </h2>

      {reviews.length > 0 ? (
        <div className="relative w-screen overflow-hidden min-h-[450px] flex justify-center items-center rounded-3xl">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentIndex}
              className="absolute left-0 right-0 mx-auto max-w-3xl p-8 rounded-3xl shadow-xl bg-gradient-to-b from-[#7d84bb] to-[#F9FBFF] w-full flex-shrink-0 flex flex-col items-center text-center min-h-[320px]"
              initial={{ x: "100vw", opacity: 0 }}
              animate={{ x: "0vw", opacity: 1 }}
              exit={{ x: "-100vw", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Gender Image */}
              <motion.img
                src={
                  reviews[currentIndex].gender?.toLowerCase() === "male"
                    ? "/male.png"
                    : "/female.png"
                }
                alt="Gender Icon"
                className="w-20 h-20 object-contain mb-4 rounded-full shadow-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* Review Details */}
              <h3 className="text-xl font-semibold text-gray-800">{reviews[currentIndex].name}</h3>

              {/* Star Ratings */}
              <div className="flex gap-1 mt-2">
                {Array.from({ length: reviews[currentIndex].rating }).map((_, index) => (
                  <motion.span
                    key={index}
                    className="text-yellow-400 text-3xl"
                    whileHover={{ scale: 1.2, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ⭐
                  </motion.span>
                ))}
              </div>

              <p className="italic text-gray-700 mt-3 text-lg font-semibold">{reviews[currentIndex].comment}</p>
              <p className="text-sm text-gray-500 mt-1">{reviews[currentIndex].date}</p>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-6 mt-6">
                <motion.button
                  className="text-2xl p-3 bg-[#2A4D80] text-white rounded-full shadow-lg hover:bg-[#1E3A60] 
                  transition-all duration-300"
                  onClick={prevSlide}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoIosArrowBack />
                </motion.button>
                <motion.button
                  className="text-2xl p-3 bg-[#2A4D80] text-white rounded-full shadow-lg hover:bg-[#1E3A60] 
                  transition-all duration-300"
                  onClick={nextSlide}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoIosArrowForward />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No reviews yet. Be the first to leave one!</p>
      )}
    </div>
  );
}
