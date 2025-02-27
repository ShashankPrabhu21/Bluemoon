"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Menu } from 'lucide-react';
import Footer from './components/footer';

export default function Home() {

  const [showMore, setShowMore] = useState(false);
  const controls = useAnimation();
  const { ref: secondSectionRef, inView: secondSectionInView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (secondSectionInView) {
      controls.start({ opacity: 1 });
    } else {
      controls.start({ opacity: 0 });
    }
  }, [secondSectionInView, controls]);

  return (
    <div className="relative h-screen w-full overflow-x-hidden bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-[#1e3799] text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo and Text */}
          <div className="flex items-center gap-2">
            <Image src="/LOGO.jpg" alt="Bluemoon Logo" width={60} height={60} className="rounded-full" />
            <div className="leading-tight">
              <h1 className="text-2xl font-bold tracking-wide">BLUEMOON</h1>
              <p className="text-sm tracking-wider">RESTAURANT</p>
            </div>
          </div>

          {/* Navbar Links */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex space-x-6 text-lg font-medium">
              <li className="cursor-pointer hover:text-gray-200">Home</li>
              <li className="cursor-pointer hover:text-gray-200">Menu</li>
              <li className="cursor-pointer hover:text-gray-200">Gallery</li>
              <li className="cursor-pointer hover:text-gray-200">Contact</li>
              <li className="cursor-pointer hover:text-gray-200">Events</li>
            </ul>
            <div className="flex gap-4">
              <Link href="#" className="bg-white text-[#1e3799] px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors">
                ORDER ONLINE (10% OFF)
              </Link>
              <Link href="#" className="border-2 border-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-[#1e3799] transition-colors">
                RESERVE A TABLE
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setShowMore(!showMore)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>


      {/* Base Image (Initial) */}
      <div className="fixed top-1/2 left-1/2 w-[calc(100vw-35px)] h-[65vh] -translate-x-1/2 -translate-y-1/2 overflow-hidden z-[1] transition-none">
        <Image
          src="/base.jpg"
          alt="Fixed Background"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          priority
        />
      </div>


      {/* Second Base Image (Appears after second section scroll) */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.01 }}
        className="fixed top-1/2 left-1/2 w-[calc(100vw-35px)] h-[65vh] transform -translate-x-1/2 -translate-y-1/2 overflow-hidden z-[2] transition-none">
        <Image
          src="/base1.jpg"
          alt="Second Base Image"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          quality={100}
          priority
        />
      </motion.div>

      <div className="relative z-[40] mt-8 w-full">
       {/*Background image */}
               <div className="w-full bg-white py-16">
                 <div className="flex w-full">
                   
                   
       
                  
                   <div className="w-[35%] bg-white p-10 flex items-center">
                     <p className="text-[#4962f4] text-lg  font-semibold text-center leading-loose">
                       As the pioneers of authentic Kerala cuisine in Sydney, we take pride in preserving traditional flavors with excellence. Renowned for our rich culinary heritage, we offer an exceptional dining experience while also specializing in bulk catering services. Whether for intimate gatherings or large-scale events, our expertly crafted dishes bring the true taste of Kerala to every occasion.
                     </p>
                   </div>
                 </div>
               </div>





        {/* Welcome Section */}
        <div className="w-full bg-gradient-to-r from-[#FFFFFF] to-[#FFF4FF] ">
          <div className="w-11/12 max-w-7xl mx-auto text-center text-black">
            <h1 className="text-4xl font-bold mb-4 text-[#3345A7]">Filling every occasion </h1>
            <p className="text-3xl font-bold text-[#3345A7] ">with great Food and Services</p>
          </div>
        </div>

        {/* first section image section */}
        <div className="w-full bg-white/95 py-16 overflow-hidden">
          <div className="flex flex-col lg:flex-row w-11/12 mx-auto gap-6">
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="flex gap-4">
                <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <Image src="/1.jpg" alt="Image Left 1" width={300} height={300} className="rounded-lg mr-4 shadow-lg" />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <Image src="/2.jpg" alt="Image Left 2" width={300} height={300} className="rounded-lg shadow-lg" />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md p-10 text-[#5e76ff] flex items-center justify-center rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">More Content</h3>
                <p className="text-lg leading-relaxed">
                  Embark on a culinary adventure at Bluemoon, where tradition meets modern innovation. We celebrate the vibrant tapestry of Indian flavors, using fresh, seasonal ingredients to create dishes that are both familiar and exciting.
                </p>
                <ul className="mt-4 list-disc list-inside">
                  <li>Authentic Flavors</li>
                  <li>Seasonal Ingredients</li>
                  <li>Modern Culinary Twist</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Second section image section */}
        <div  className="h-[250px]"></div>   
        <div className="w-full bg-white/95 py-16 overflow-hidden">
          <div className="flex flex-col lg:flex-row w-11/12 mx-auto gap-6">
            {/* Text on the Left Side */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md p-10 text-[#5e76ff] flex items-center justify-center rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">Even More Content</h3>
                <p className="text-lg leading-relaxed">
                  Discover new tastes at Bluemoon with more surprises awaiting you. We continue to explore contemporary dishes infused with the rich heritage of Indian cuisine.
                </p>
                <ul className="mt-4 list-disc list-inside">
                  <li>Innovative Recipes</li>
                  <li>Signature Dishes</li>
                  <li>Unforgettable Dining Experience</li>
                </ul>
              </div>
            </motion.div>

            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="flex gap-4">
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Image
                    src="/2.jpg"  alt="Image Right 1" width={300} height={300} className="rounded-lg mr-4 shadow-lg"   
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Image  
                    src="/1.jpg" alt="Image Right 2" width={300} className="rounded-lg shadow-lg" height={300}
                    />  
                </motion.div>                                                                
              </div>
            </div>
          </div>
        </div>


        <div  ref={secondSectionRef}></div>
         {/* Third section image section */}
         <div ref={secondSectionRef} className="h-[250px]"></div>   
        <div  className="w-full bg-white/95 py-16 overflow-hidden">
          <div className="flex flex-col lg:flex-row w-11/12 mx-auto gap-6">
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="flex gap-4">
                <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
                  <Image src="/1.jpg" alt="Image Left 1" width={300} height={300} className="rounded-lg mr-4 shadow-lg" />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.8 }}>
                  <Image src="/2.jpg" alt="Image Left 2" width={300} height={300} className="rounded-lg shadow-lg" />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="w-full lg:w-1/2 bg-white/10 backdrop-blur-md p-10 text-black flex items-center justify-center rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-3xl font-bold mb-4">Even More Content</h3>
                <p className="text-lg leading-relaxed">
                  Discover new tastes at Bluemoon with more surprises awaiting you. We continue to explore contemporary dishes infused with the rich heritage of Indian cuisine.
                </p>
                <ul className="mt-4 list-disc list-inside">
                  <li>Innovative Recipes</li>
                  <li>Signature Dishes</li>
                  <li>Unforgettable Dining Experience</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
         <Footer />
    </div>
  );
}
