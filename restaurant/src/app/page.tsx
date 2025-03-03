"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import Navbar from "./components/navbar";
import Reviews from "./components/reviews";
import { motion } from "framer-motion";
import Footer from "./components/footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UtensilsCrossed, ChefHat } from "lucide-react"; 
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";

export default function Home() {
  {/*Base Images */}
  const { ref: gapRef1, inView: gapInView1 } = useInView({ threshold: 0.0 });
  const { ref: gapRef2, inView: gapInView2 } = useInView({ threshold: 0.05 });
  const { ref: gapRef3, inView: gapInView3 } = useInView({ threshold: 0.05 });

  {/*Offer Carousels */}
  const images = ["/off1.png", "/off2.png", "/off3.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // Auto-slide every 4s
    return () => clearInterval(interval);
  }, []);
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Hero Section Transition
  const slides = [
    {
      image: "/sec1.jpg",
      title: "A New Chapter in Indian",
      highlight: "Cuisine",
      subtitle: "Fresh, Bold, Indian",
      description:
        "A new chapter in Kerala cuisine, blending tradition with modern culinary innovation.",
      position: "bottom-10 left-1/2 transform -translate-x-1/2 text-center",
    },
    {
      image: "/1.jpg",
      title: "Experience the Essence of",
      highlight: "Flavors",
      subtitle: "Authentic Spices, Modern Taste",
      description: "Delicately curated dishes infused with tradition & creativity.",
      position: "bottom-10 left-7 text-center",
    },
    {
      image: "/sec2.jpg",
      title: "Kerala's Spice",
      highlight: "Reimagined",
      subtitle: "Fresh catches, bold flavors, a modern twist.",
      description: "A new chapter in coastal culinary artistry.",
      position: "bottom-20 right-5 transform -translate-x-1/2 text-center text-black",
    },
  ];  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2100);
    
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="relative w-full overflow-x-hidden bg-transparent">
      <Navbar />
      {/*Hero Section */}
      <section
      className="relative h-[95vh] flex items-center justify-center text-white z-30 overflow-hidden"
      id="hero-section"
    >
      {/* Hero Section Background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
          </motion.div>
        ))}
      </div>
      {/* Animated Text Content */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1 }}
        className={`absolute ${slides[currentIndex].position} px-4 z-10`}
      >
        <h3 className="text-lg font-semibold tracking-wider">
          {slides[currentIndex].subtitle}
        </h3>
        <h1 className="text-5xl font-bold mt-2">
          {slides[currentIndex].title} <span className="block">{slides[currentIndex].highlight}</span>
        </h1>
        {slides[currentIndex].description && (
          <p className="text-lg mt-4 max-w-2xl">{slides[currentIndex].description}</p>
        )}
      </motion.div>
    </section>

      {/* Buttons */}
      <div className="relative z-30 w-full mt-10">
        <div className="bg-white py-5 flex justify-center gap-6">
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            RESERVE A TABLE
          </button>
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            ONLINE PICKUP ORDERS
          </button>
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            DELIVERY AVAILABLE
          </button>
        </div>
      </div>

      {/* Carousel Slider */}
      <div className="relative mx-auto w-[70%] flex justify-center items-center mt-8 mb-8 py-12 bg-gradient-to-r from-[#2C3E50] via-[#4c4caf] to-[#2C3E50] shadow-lg rounded-[30px]">
        {/* Images Container */}
        <div className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((src, index) => (
            <div key={index} className="min-w-full flex justify-center">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                width={900}
                height={600}
                className="w-auto h-[63vh] object-contain rounded-2xl transition-transform duration-500 ease-in-out hover:scale-105 shadow-2xl"
              />
            </div>
          ))}
        </div>
        {/* Left Arrow */}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        {/* Right Arrow */}
        <button onClick={nextSlide} className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 p-3 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
    </div>

      

      <div className="relative z-10 w-full">
        {/**First Section */}
        <div className="w-full relative py-16 overflow-hidden bg-cover bg-center bg-[url('/sec11.jpg')]">
              {/* Overlay for opacity effect */}
              <div className="absolute inset-0 bg-black/40"></div>
        
              <div className="relative flex flex-col lg:flex-row w-11/12 mx-auto gap-6">
                {/* Left Images Section */}
                <div className="w-full lg:w-1/2 flex justify-center items-center">
                  <div className="flex gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <Image
                        src="/1.jpg"
                        alt="Image Left 1"
                        width={300}
                        height={300}
                        className="rounded-lg mr-4 shadow-lg"
                      />
                    </motion.div>
        
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    >
                      <Image
                        src="/2.jpg"
                        alt="Image Left 2"
                        width={300}
                        height={300}
                        className="rounded-lg shadow-lg"
                      />
                    </motion.div>
                  </div>
                </div>
        
                {/* Right Text Section */}
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 1.6 }}
                  className="w-full lg:w-1/2 bg-white/90 p-10 text-[#3345A7] flex items-center justify-center rounded-2xl shadow-xl"
                >
                  <div>
                    <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">
                      BLUEMOON RESTAURANT
                    </h3>
                    <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">
                      KERALA CUISINE
                    </h3>
                    <p className="text-lg leading-relaxed text-[#3345A7]">
                      Embark on a culinary journey at Bluemoon Restaurant, where every dish is a celebration of
                      flavor and artistry. Our chefs meticulously select the finest ingredients, transforming
                      them into culinary masterpieces that tantalize the senses. From the first bite to the
                      lingering aftertaste, your dining experience with us will be nothing short of extraordinary.
                    </p>
                    <div className="mt-6">
                      <button className="px-6 py-3 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
                        Discover More
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

        {/* First Gap Section */}
        <div ref={gapRef1} className="h-[250px] relative">
          {gapInView1 && (
            <div className="fixed inset-0 w-full h-screen z-[-1]">
              <Image
                src="/sec3.jpg"
                alt="Fixed Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                quality={100}
                priority
                className="!opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>
          )}
        </div>

        {/**Second Section */}
        <div 
      className="relative w-full bg-white/80 backdrop-blur-xl py-32 px-6 lg:px-0 text-gray-900 shadow-md border border-[#3345A7]/40"
      style={{
        backgroundImage: "url('/sec22.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="relative z-10 w-11/12 mx-auto flex justify-end lg:justify-end items-center gap-10">
        {/* Right Cards Section Only */}
        <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-6 ml-16 pl-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#3345A7]/60"
          >
            <UtensilsCrossed size={50} className="text-[#3345A7] mx-auto" />
            <h3 className="text-2xl font-semibold mt-4 text-center text-[#3345A7]">Quality Food</h3>
            <p className="text-lg mt-2 text-center text-gray-700">
            &quot;Deliciously crafted dishes blending fresh, seasonal ingredients with authentic Indian spices and innovation.&quot;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#3345A7]/60"
          >
            <ChefHat size={50} className="text-[#3345A7] mx-auto" />
            <h3 className="text-2xl font-semibold mt-4 text-center text-[#3345A7]">Perfect Taste</h3>
            <p className="text-lg mt-2 text-center text-gray-700">
            &quot;Exceptional dishes blending fresh, seasonal ingredients with authentic Indian spices and innovative flair.&quot;
            </p>
          </motion.div>
        </div>
      </div>
  </div>

        {/* Second Gap Section */}
        <div ref={gapRef2} className="h-[250px] relative">
          {gapInView2 && (
            <div className="fixed inset-0 w-full h-screen z-[-1]">
              <Image
                src="/sec1.jpg"
                alt="Fixed Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                quality={100}
                priority
                className="!opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>
          )}
        </div>

        {/**Third Section */}
        <div>
      {/* Main Section */}
      <section className="bg-white/60 py-16 px-6 text-center" style={{
        backgroundImage: "url('/sec11.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>
        {/* Animated Heading */}
        <motion.h2
          className="text-[#ffffff] text-3xl font-bold uppercase tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          WHY PEOPLE LOVE US
        </motion.h2>

        {/* Animated Paragraph */}
        <motion.p
          className="text-white text-lg max-w-2xl mx-auto mt-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          viewport={{ once: true }}
        >
          At Bluemoon, we are passionate about delivering an exceptional dining
          experience that combines the best of traditional Indian cuisine with modern
          innovation.
        </motion.p>

        {/* Cards Section with Animation */}
        <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
          {[
            {
              icon: <FaUtensils className="text-[#3345A7] text-4xl mx-auto mb-4" />,
              title: "Authentic Flavors with a Modern Twist",
              text: "Our menu reimagines classic Indian dishes with contemporary flair, creating a unique culinary experience that honors tradition while embracing innovation."
            },
            {
              icon: <FaLeaf className="text-[#3345A7] text-4xl mx-auto mb-4" />,
              title: "Fresh, Seasonal Ingredients",
              text: "We take pride in using only the freshest, seasonal ingredients to craft our dishes. This commitment ensures every meal is vibrant and nourishing."
            },
            {
              icon: <FaStar className="text-[#3345A7] text-4xl mx-auto mb-4" />,
              title: "Memorable Dining Experience",
              text: "Guests love Bluemoon for unforgettable dining experiences. Whether casual or special, we make every visit memorable with great food and hospitality."
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-8 max-w-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6 * index }}
              viewport={{ once: true }}
            >
              {card.icon}
              <h3 className="text-xl font-semibold text-center">{card.title}</h3>
              <p className="text-[#3345A7] mt-3 text-center">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>

        {/* Third Gap Section */}
        <div ref={gapRef3} className="h-[250px] relative">
          {gapInView3 && (
            <div className="fixed inset-0 w-full h-screen z-[-1]">
              <Image
                src="/sec11.jpg"
                alt="Fixed Background"
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                quality={100}
                priority
                className="!opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>
          )}
        </div>

        <Reviews />
      </div>

      <Footer />
    </div>
  );
}
