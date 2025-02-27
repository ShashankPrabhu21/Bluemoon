"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UtensilsCrossed, ChefHat } from "lucide-react";
import Footer from './components/footer';
import { FaUtensils, FaLeaf, FaStar } from "react-icons/fa";
import Navbar from './components/navbar';

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
      <Navbar />


      {/* Base Image (Initial) */}
      <div className="fixed  top-[20%]  left-0 w-[calc(100vw-18px)] h-[65vh] overflow-hidden z-10 transition-none">
        <Image
          src="/sec3.jpg"
          alt="Fixed Background"
          layout="fill"
          objectFit="cover"
          objectPosition="left top" // Ensures the image expands upwards
          quality={100}
          priority
        />
      </div>


      {/* Second Base Image (Appears after second section scroll) */}
      <motion.div
        animate={controls}
        initial={{ opacity: 0 }}
        transition={{ duration: 0 }}
        className="fixed  top-[20%]  left-0 w-[calc(100vw-18px)] h-[66vh] overflow-hidden z-20"
      >
        <Image
          src="/sec1.jpg"
          alt="Second Base Image"
          layout="fill"
          objectFit="cover"
          objectPosition="left top" // Ensures the image stretches upwards
          quality={100}
          priority
        />
      </motion.div>



      <div className="relative z-30 mt-8 w-full">
       {/*Background image */}
       <div className="w-full bg-white py-8 pt-16">
        <div className="flex w-11/12 mx-auto">   
          {/* Left Text Section - 35% */}
          <div className="w-full flex items-center bg-white py-16">
            {/* Right Image Section */}
            <div className="w-[65%] flex justify-center">
              <img 
                src="/kerala.png"  // Replace with your actual image path
                alt="Kerala Cuisine"
                className="w-full h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
            {/* Left Text Section */}
            <div className="w-[35%] bg-white p-10 flex justify-center items-center">
              <p className="text-[#3345A7] text-lg font-semibold text-center leading-loose">
                As the pioneers of authentic Kerala cuisine in Sydney, we take pride in preserving traditional flavors with excellence. Renowned for our rich culinary heritage, we offer an exceptional dining experience while also specializing in bulk catering services. Whether for intimate gatherings or large-scale events, our expertly crafted dishes bring the true taste of Kerala to every occasion.
              </p>
            </div> 
          </div>
        </div>
      </div>


        {/* Welcome Section */}
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


        {/* first section image section */}
       
        <div className="w-full bg-white/95 py-16 overflow-hidden">
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
              className="w-full lg:w-1/2 bg-white p-10 text-[#3345A7] flex items-center justify-center rounded-2xl shadow-xl"
            >
              <div>
                <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">BLUEMOON RESTAURANT</h3>
                <h3 className="text-4xl font-bold mb-4 text-[#3345A7]">KERALA CUISINE</h3>
                <p className="text-lg leading-relaxed text-[#3345A7]">
                Embark on a culinary journey at Bluemoon Restaurant, where every dish is a celebration of flavor and artistry.  Our chefs meticulously select the finest ingredients, transforming them into culinary masterpieces that tantalize the senses.  From the first bite to the lingering aftertaste, your dining experience with us will be nothing short of extraordinary. </p>
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
            backgroundImage: "url('/sec2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          <div className="relative z-10 w-11/12 mx-auto flex flex-col lg:flex-row items-center gap-10">
            {/* Left Text Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full lg:w-1/2 text-left"
            >
              <h2 className="text-4xl font-bold mb-4 leading-tight text-black">
                Unveiling modern Indian flavors in a fine-dining experience.
              </h2>
            </motion.div>
      {/* Right Cards Section */}
            <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 bg-white/70 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-[#3345A7]/60"
              >
                <UtensilsCrossed size={50} className="text-[#3345A7] mx-auto" />
                <h3 className="text-2xl font-semibold mt-4 text-center text-[#3345A7]">Quality Food</h3>
                <p className="text-lg mt-2 text-center text-gray-700">
                  "Deliciously crafted dishes blending fresh, seasonal ingredients with authentic Indian spices and innovation."
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
                  "Exceptional dishes blending fresh, seasonal ingredients with authentic Indian spices and innovative flair."
                </p>
              </motion.div>
          </div>
        </div>
      </div>




        <div  ref={secondSectionRef}></div>



          {/* Third section  */}
        <div ref={secondSectionRef} className="h-[220px]"></div>   
          
        <section className="bg-white py-16 px-6 text-center">
        <h2 className="text-[#3345A7] text-3xl font-bold uppercase tracking-wide">
          WHY PEOPLE LOVE US
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mt-3">
          At Bluemoon, we are passionate about delivering an exceptional dining
          experience that combines the best of traditional Indian cuisine with
          modern innovation.
        </p>

        <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
          {/* Card 1 */}
          <div className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-8 max-w-sm">
            <FaUtensils className="text-[#3345A7] text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center">Authentic Flavors with a Modern Twist</h3>
            <p className="text-[#3345A7] mt-3 text-center">
              Our menu reimagines classic Indian dishes with contemporary flair,
              creating a unique culinary experience that honors tradition while
              embracing innovation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-8 max-w-sm">
            <FaLeaf className="text-[#3345A7] text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center">Fresh, Seasonal Ingredients</h3>
            <p className="text-[#3345A7] mt-3 text-center">
              We take pride in using only the freshest, seasonal ingredients to
              craft our dishes. This commitment ensures every meal is vibrant and
              nourishing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-[#3345A7] border-2 border-[#3345A7] rounded-xl shadow-lg p-8 max-w-sm">
            <FaStar className="text-[#3345A7] text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center">Memorable Dining Experience</h3>
            <p className="text-[#3345A7] mt-3 text-center">
              Guests love Bluemoon for unforgettable dining experiences. Whether
              casual or special, we make every visit memorable with great food and
              hospitality.
            </p>
          </div>
        </div>
      </section>
    </div>
  <Footer />
  </div>
  );
}
