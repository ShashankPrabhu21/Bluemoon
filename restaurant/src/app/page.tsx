"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UtensilsCrossed, ChefHat } from "lucide-react";
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";

export default function Home() {

 
  const controls = useAnimation();
  const { ref: secondSectionRef, inView: secondSectionInView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (secondSectionInView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [secondSectionInView, controls]);


  {/*Hero Section Transition */}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 2100); 
    return () => clearInterval(interval);
  }, []);



{/*Base Image Appearance */}
const [showBaseImage, setShowBaseImage] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowBaseImage(!entry.isIntersecting); // Show when Welcome Section is out of view
    },
    { threshold: 0.1 }
  );
  const heroSection = document.getElementById("hero-section");
  if (heroSection) {
    observer.observe(heroSection);
  }
  return () => {
    if (heroSection) observer.unobserve(heroSection);
  };
}, []);


  return (
    <div className="relative h-screen w-full overflow-x-hidden bg-white/95">
    
      {/* Hero Section Image */}
      <section className="relative h-[95vh] flex items-center justify-center text-white z-30  overflow-hidden" id="hero-section" >
      <div className="absolute inset-0" >
        {slides.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 1.1 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Enhanced Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
          </motion.div>
        ))}
      </div>
      {/* Animated Text Content */}
      <motion.div
        key={currentIndex} // Forces re-render to animate text
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 1 }}
        className={`absolute ${slides[currentIndex].position} px-4 z-10`}
      >
        <h3 className="text-lg font-semibold tracking-wider">{slides[currentIndex].subtitle}</h3>
        <h1 className="text-5xl font-bold mt-2">
          {slides[currentIndex].title} <span className="block">{slides[currentIndex].highlight}</span>
        </h1>
        {slides[currentIndex].description && (
          <p className="text-lg mt-4 max-w-2xl">{slides[currentIndex].description}</p>
        )}
      </motion.div>
    </section>


      {/* Base Image (First) - Hidden Until Scrolled */}
      {showBaseImage && (
        <div className="fixed top-[20%] left-0 w-[calc(100vw-18px)] h-[65vh] overflow-hidden z-10 transition-none">
          <Image
            src="/sec3.jpg"
            alt="Fixed Background"
            layout="fill"
            objectFit="cover"
            objectPosition="left top"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
        </div>
      )}

      {/* Second Base Image */}
      {showBaseImage && (
        <motion.div
          animate={controls}
          initial={{ opacity: 0 }}
          transition={{ duration: 0 }}
          className="fixed top-[20%] left-0 w-[calc(100vw-18px)] h-[66vh] overflow-hidden z-20"
        >
          <Image
            src="/sec1.jpg"
            alt="Second Base Image"
            layout="fill"
            objectFit="cover"
            objectPosition="left top"
            quality={100}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90" />
        </motion.div>
      )}
      

      {/*Buttons*/}
      <div className="relative z-30 mt-10 w-full">
         <div  className="relative z-30 w-full mb-10">
        <div className="bg-white py-5 flex justify-center gap-6">
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            RESERVE A TABLE
          </button>
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            10% OFF ON ONLINE PICKUP ORDERS
          </button>
          <button className="px-8 py-4 border border-[#3345A7] text-[#3345A7] text-lg font-semibold rounded-lg hover:bg-[#3345A7] hover:text-white transition duration-300">
            DELIVERY AVAILABLE
          </button>
        </div>
      </div>


       {/* First Section with Background Image */}
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
              <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">BLUEMOON RESTAURANT</h3>
              <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">KERALA CUISINE</h3>
              <p className="text-lg leading-relaxed text-[#3345A7]">
                Embark on a culinary journey at Bluemoon Restaurant, where every dish is a celebration of
                flavor and artistry. Our chefs meticulously select the finest ingredients, transforming
                them into culinary masterpieces that tantalize the senses. From the first bite to the
                lingering aftertaste, your dining experience with us will be nothing short of
                extraordinary.
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

        

        {/* Second section  */}
        <div  className="h-[250px]"></div>   
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


{/* Third section  */}
        <div  ref={secondSectionRef}></div>
        <div ref={secondSectionRef} className="h-[220px]"></div>      
        <section className="bg-white/95 py-16 px-6 text-center">
          {/* Animated Heading */}
          <motion.h2
            className="text-[#3345A7] text-3xl font-bold uppercase tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            WHY PEOPLE LOVE US
          </motion.h2>
          {/* Animated Paragraph */}
          <motion.p
            className="text-gray-700 text-lg max-w-2xl mx-auto mt-3"
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
  
  </div>
  );
}
