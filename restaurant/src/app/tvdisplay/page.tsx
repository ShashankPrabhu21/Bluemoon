"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TVNavbar from "../components/TVNavbar";
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  category_name?: string; // Assuming your API response includes category name
}

interface GalleryItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
  category: string;
  title: string;
}

// Sample static data
const sampleItems: GalleryItem[] = [
  { id: 1, type: "image", src: "/DSC05783.jpg", category: "dishes", title: "Signature Dish" },
  { id: 2, type: "image", src: "/DSC03118-Enhanced-NR.jpg", category: "drinks", title: "Drinks Corner" },
  { id: 3, type: "video", src: "/photo reel.mp4", category: "events", title: "Food Highlight" },
  { id: 4, type: "video", src: "https://www.youtube.com/watch?v=HU3wAPrJ-I8&t=13s", category: "events", title: "Event" },
  { id: 5, type: "image", src: "/DSC05767.jpg", category: "dishes", title: "Kerala Food" },
  { id: 6, type: "video", src: "/Bluemoon.mp4", category: "events", title: "New Event Video" },
  { id: 7, type: "image", src: "/DSC05744.jpg", category: "interior", title: "Elegant Interior" },
  { id: 8, type: "image", src: "/DSC03068-Enhanced-NR.jpg", category: "dishes", title: "Thali" },
  { id: 9, type: "image", src: "/DSC05743.jpg", category: "interior", title: "Interior" },
  { id: 10, type: "video", src: "https://www.youtube.com/watch?v=WtpatE5-Okc&t=11s", category: "events", title: "Events" },
  { id: 11, type: "image", src: "/DSC05746.jpg", category: "dishes", title: "Dish" },
  { id: 12, type: "image", src: "/DSC03072.jpg", category: "dishes", title: "Elegant Dish" },
];

const HeroSection = () => {
  const [showHero, setShowHero] = useState(true);
  const [showSecondSection, setShowSecondSection] = useState(false);
  const [showThirdSection, setShowThirdSection] = useState(false);
  const [showFoodItemsSection, setShowFoodItemsSection] = useState(false);
  const [showGallerySection, setShowGallerySection] = useState(false);
  const [foodItemsByCategory, setFoodItemsByCategory] = useState<{ [key: string]: FoodItem[] }>({});
  const foodItemsContainerRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const cycleTimeout = useRef<NodeJS.Timeout | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categoryOrder = ["Breakfast", "Main Course", "Snacks", "Drinks", "Desserts"]; // Define the order

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menuitem");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data: FoodItem[] = await res.json();

        // Group food items by category
        const grouped: { [key: string]: FoodItem[] } = {};
        data.forEach((item) => {
          if (item.category_name) {
            if (!grouped[item.category_name]) {
              grouped[item.category_name] = [];
            }
            grouped[item.category_name].push(item);
          }
        });
        setFoodItemsByCategory(grouped);
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
      }, 3000);
      return () => clearTimeout(heroTimer);
    }
  }, [showHero]);

  useEffect(() => {
    if (showSecondSection) {
      const secondSectionTimer = setTimeout(() => {
        setShowSecondSection(false);
        setShowThirdSection(true);
      }, 3000);
      return () => clearTimeout(secondSectionTimer);
    }
  }, [showSecondSection]);

  useEffect(() => {
    if (showThirdSection) {
      const thirdSectionTimer = setTimeout(() => {
        setShowThirdSection(false);
        setShowFoodItemsSection(true);
      }, 3000);
      return () => clearTimeout(thirdSectionTimer);
    }
  }, [showThirdSection]);

  useEffect(() => {
    if (showFoodItemsSection && foodItemsContainerRef.current) {
      const container = foodItemsContainerRef.current;
      let animationFrameId: number | null = null;
      let startTime: number | null = null;
      const duration = 140000;

      const scroll = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        container.scrollTop = progress * (container.scrollHeight - container.clientHeight);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(scroll);
        } else {
          setShowFoodItemsSection(false);
          setShowGallerySection(true);
        }
      };

      startTime = null;
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
  }, [showFoodItemsSection, foodItemsByCategory]); // Changed dependency to trigger re-run if categories change

  useEffect(() => {
    if (showGallerySection) {
      setGalleryItems(sampleItems);
      const container = galleryContainerRef.current;
      let animationFrameId: number | null = null;
      let startTime: number | null = null;
      const duration = 18000;

      const scroll = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (container) {
          container.scrollTop = progress * (container.scrollHeight - container.clientHeight);

          if (progress < 1) {
            animationFrameId = requestAnimationFrame(scroll);
          } else {
            setShowGallerySection(false);
            setShowHero(true);
          }
        }
      };

      startTime = null;
      animationFrameId = requestAnimationFrame(scroll);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [showGallerySection]);

  const getVideoId = (url: string): string | null => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );

  const goToNext = () =>
    setCurrentImageIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryItems]);

  const groupItemsIntoRows = (items: GalleryItem[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  };

  const itemRows = groupItemsIntoRows(galleryItems);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[url('/sec11.jpg')] bg-cover bg-center before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/70 before:to-black/80 before:z-0">
  
      <TVNavbar />

      {showFoodItemsSection && (
        // ----------------- FOOD ITEMS SECTION ------------------
        <section className="relative py-24 mt-12 overflow-hidden bg-[url('/sec11.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/90 z-0"></div>
          <div className=" relative container mx-auto px-4 relative z-10">
            <div
              className="flex flex-col gap-8 overflow-y-auto max-h-[75vh]"
              ref={foodItemsContainerRef}
            >
              {categoryOrder.map((categoryName) => (
                foodItemsByCategory[categoryName] &&
                foodItemsByCategory[categoryName].length > 0 && (
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
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {showGallerySection && (
        <main className="relative w-full text-white mt-12 z-10">
          <div
            className="relative w-full bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec22.jpg')",
            }}
          >
            <div className="container mx-auto px-4 py-12 text-center">
              <h2 className="text-4xl font-bold mb-4 mt-12 ">Our Gallery</h2>
              <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
              <p className="max-w-2xl mx-auto">
                Experience the elegant ambiance and exquisite cuisine of Bluemoon
                Restaurant through our gallery.
              </p>
            </div>
          </div>

          <div className="w-full overflow-y-auto max-h-[75vh] z-10" ref={galleryContainerRef}>
            {itemRows.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div
                  className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      rowIndex % 2 === 0
                        ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec11.jpg')"
                        : "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec4.jpg')",
                  }}
                >
                  {row.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative group cursor-pointer"
                      onClick={() => openLightbox(rowIndex * 4 + index)}
                    >
                      <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">
                        {item.type === "image" && (
                          <Image
                            src={item.src}
                            alt={item.alt || item.title}
                            fill
                            className="object-cover"
                            priority={rowIndex < 1 && index < 4}
                          />
                        )}
                        {item.type === "video" && getVideoId(item.src) && (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${getVideoId(item.src)}`} // Use https://
                            title={item.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        )}
                        {item.type === "video" && !getVideoId(item.src) && (
                          <video
                            src={item.src}
                            controls
                            className="object-cover w-full h-full"
                          />
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
                {rowIndex < itemRows.length - 1 && (
                  <div
                    className="w-full h-[100px] bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
                      backgroundAttachment: "fixed", }}
                      ></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
    
              {lightboxOpen && galleryItems[currentImageIndex] && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                  <button
                    className="absolute top-5 right-5 text-white"
                    onClick={closeLightbox}
                  >
                    <X size={32} />
                  </button>
                  <button className="absolute left-5 text-white" onClick={goToPrevious}>
                    <ChevronLeft size={48} />
                  </button>
                  <div className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg bg-black flex items-center justify-center">
                    {galleryItems[currentImageIndex].type === "image" && (
                      <Image
                        src={galleryItems[currentImageIndex].src}
                        alt={
                          galleryItems[currentImageIndex].alt ||
                          galleryItems[currentImageIndex].title
                        }
                        width={500}
                        height={600}
                        className="object-contain"
                        priority
                      />
                    )}
                    {galleryItems[currentImageIndex].type === "video" && getVideoId(galleryItems[currentImageIndex].src) && (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${getVideoId(galleryItems[currentImageIndex].src)}?autoplay=1&mute=1`} // Use https://
                        title={galleryItems[currentImageIndex].title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    )}
                    {galleryItems[currentImageIndex].type === "video" && !getVideoId(galleryItems[currentImageIndex].src) && (
                      <video
                        src={galleryItems[currentImageIndex].src}
                        controls
                        className="object-contain w-full h-full"
                      />
                    )}
                  </div>
                  <button className="absolute right-5 text-white" onClick={goToNext}>
                    <ChevronRight size={48} />
                  </button>
                </div>
              )}
            </main>
          )}
    
          {showHero && (
            // ----------------- HERO SECTION ------------------
            <section
              className="relative h-screen flex items-center justify-center text-white z-30 "
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
                className="relative bg-white/60 py-16 px-4 md:px-6 text-center mt-32 min-h-[85vh] z-10"
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