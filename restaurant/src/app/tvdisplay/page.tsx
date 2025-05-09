"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TVNavbar from "../components/TVNavbar";
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";

// Hero Slides
const slides = [
  {
    image: "/1.jpg",
    title: "Experience the Essence of",
    highlight: "Flavors",
    subtitle: "Authentic Spices, Modern Taste",
    description: "Delicately curated dishes infused with tradition & creativity.",
    position: "bottom-10 left-7 text-center",
  },
];

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spicy_level: string;
  quantity: number;
}

const HeroSection = () => {
  const [showHero, setShowHero] = useState(true);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [showThirdSection, setShowThirdSection] = useState(false);
  const [showFoodItemsSection, setShowFoodItemsSection] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const foodItemsContainerRef = useRef<HTMLDivElement>(null);
  const cycleTimeout = useRef<NodeJS.Timeout | null>(null);
  const isScrolling = useRef(false);

  const resetCycle = () => {
    setShowFoodItemsSection(false);
    setShowHero(true);
    // The useEffect for showHero will handle the transition to the next section
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        setFoodItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (showHero) {
      const heroTimer = setTimeout(() => {
        setShowHero(false);
        setShowSecondSection(true);
      }, 2800);
      return () => clearTimeout(heroTimer);
    }
  }, [showHero]);

  useEffect(() => {
    if (showSecondSection) {
      const secondSectionTimer = setTimeout(() => {
        setShowSecondSection(false);
        setShowThirdSection(true);
      }, 2500);
      return () => clearTimeout(secondSectionTimer);
    }
  }, [showSecondSection]);

  useEffect(() => {
    if (showThirdSection) {
      const thirdSectionTimer = setTimeout(() => {
        setShowThirdSection(false);
        setShowFoodItemsSection(true);
      }, 2500);
      return () => clearTimeout(thirdSectionTimer);
    }
  }, [showThirdSection]);

  useEffect(() => {
    if (showFoodItemsSection && foodItemsContainerRef.current) {
      const container = foodItemsContainerRef.current;
      let animationFrameId: number | null = null;
      let startTime: number | null = null;
      const duration = 25000;

      const scroll = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        container.scrollTop = progress * (container.scrollHeight - container.clientHeight);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(scroll);
        } else {
          // Reset the cycle immediately after scrolling finishes
          resetCycle();
        }
      };

      startTime = null; // Reset startTime for each activation of this useEffect
      animationFrameId = requestAnimationFrame(scroll);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        if (cycleTimeout.current) {
          clearTimeout(cycleTimeout.current);
        }
      };
    }
  }, [showFoodItemsSection, foodItems]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white/95">
      <TVNavbar />

      {showFoodItemsSection && (
        // ----------------- FOOD ITEMS SECTION ------------------
        <section className="py-24 bg-white mt-12 overflow-hidden">
          <div className="container mx-auto px-4">
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 overflow-y-auto max-h-[75vh]"
              ref={foodItemsContainerRef}
            >
              {foodItems.map((item) => (
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

                  {/* Overlay for content */}
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
        </section>
      )}

      {showHero && (
        // ----------------- HERO SECTION ------------------
        <section
          className="relative h-screen flex items-center justify-center text-white z-30"
          id="hero-section"
        >
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className={`absolute ${slides[0].position} px-4 z-10`}
          >
            <h3 className="text-lg font-semibold tracking-wider">
              {slides[0].subtitle}
            </h3>
            <h1 className="text-5xl font-bold mt-2">
              {slides[0].title}{" "}
              <span className="block">{slides[0].highlight}</span>
            </h1>
            {slides[0].description && (
              <p className="text-lg mt-4 max-w-2xl">{slides[0].description}</p>
            )}
          </motion.div>
        </section>
      )}

      {showSecondSection && (
        // --------------- SECOND SECTION -----------------
        <div className="mt-32 relative z-10 w-full min-h-[85vh]">
          <div className="w-full relative py-12 md:py-16 overflow-hidden bg-cover bg-center bg-[url('/sec11.jpg')] min-h-[85vh]">
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative flex flex-col lg:flex-row w-[95%] md:w-11/12 mx-auto gap-8 md:gap-12">
              {/* Left Section with Images */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <div className="flex gap-4 flex-nowrap justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="w-1/2"
                  >
                    <Image
                      src="/1.jpg"
                      alt="Image Left 1"
                      width={250}
                      height={250}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="w-1/2"
                  >
                    <Image
                      src="/2.jpg"
                      alt="Image Left 2"
                      width={250}
                      height={250}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Right Section with Text */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="w-full lg:w-1/2 bg-white/90 p-6 md:p-10 text-[#3345A7] flex items-center justify-center rounded-2xl shadow-xl"
              >
                <div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    BLUEMOON RESTAURANT
                  </h3>
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                    KERALA CUISINE
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed">
                    Embark on a culinary journey at Bluemoon Restaurant, where
                    every dish is a celebration of flavor and artistry. Our
                    chefs meticulously select the finest ingredients,
                    transforming them into culinary masterpieces that tantalize
                    the senses.
                  </p>
                  <div className="mt-4 md:mt-6 flex justify-center md:justify-start">
                    <Link href="/menu">
                      <button className="px-5 py-3 md:px-6 md:py-3 border border-[#3345A7] text-[#3345A7] text-sm md:text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
                        Discover More
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {showThirdSection && (
        // {/**Third Section */}
        <div>
          <section
            className="bg-white/60 py-16 px-4 md:px-6 text-center mt-32 min-h-[85vh]"
            style={{
              backgroundImage: "url('/sec11.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Animated Heading */}
            <motion.h2
              className="text-[#ffffff] text-2xl md:text-3xl font-bold uppercase tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              WHY PEOPLE LOVE US
            </motion.h2>

            <motion.p
              className="text-white text-base md:text-lg max-w-2xl mx-auto mt-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              viewport={{ once: true }}
            >
              At Bluemoon, we are passionate about delivering an exceptional dining experience that
              combines the best of traditional Indian cuisine with modern innovation.
            </motion.p>

            {/* Cards Section with Animation */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {[
                {
                  icon: <FaUtensils className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Authentic Flavors with a Modern Twist",
                  text: "Our menu reimagines classic Indian dishes with contemporary flair, creating a unique culinary experience that honors tradition while embracing innovation.",
                },
                {
                  icon: <FaLeaf className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Fresh, Seasonal Ingredients",
                  text: "We take pride in using only the freshest, seasonal ingredients to craft our dishes. This commitment ensures every meal is vibrant and nourishing.",
                },
                {
                  icon: <FaStar className="text-[#3345A7] text-4xl mx-auto mb-4" />,
                  title: "Memorable Dining Experience",
                  text: "Guests love Bluemoon for unforgettable dining experiences. Whether casual or special, we make every visit memorable with great food and hospitality.",
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-6 md:p-8 max-w-sm mx-auto"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 0.6 * index }}
                  viewport={{ once: true }}
                >
                  {card.icon}
                  <h3 className="text-lg md:text-xl font-semibold text-center">{card.title}</h3>
                  <p className="text-[#3345A7] mt-3 text-center">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default HeroSection;