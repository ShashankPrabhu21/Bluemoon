"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Food",
    "Seasonal",
    "Dessert",
    "Restaurant History",
    "Recipes",
    "Cooking Tips",
  ];

  const blogContent = [
    {
      category: "Food",
      title: "A Taste of Joy",
      subtitle: "Exploring the wonderful world of food",
      content: [
        {
          heading: "The Power of Comfort Food",
          text: "Everyone has that one dish that instantly feels like a warm hug on a cold day. Comfort food holds the power to heal the soul and transport us back to happy times.",
        },
        {
          heading: "The Joy of Sharing Meals",
          text: "In every culture, sharing meals is a sacred tradition. Family gatherings, celebrations, and casual get-togethers often revolve around the dining table.",
        },
        {
          heading: "A Healthier Plate, A Happier Life",
          text: "The food choices we make have a profound impact on our health and well-being. Fresh fruits, colorful vegetables, lean proteins, and wholesome grains provide essential nutrients.",
        },
        {
          heading: "Celebrate Food Every Day",
          text: "Whether you’re savoring your morning coffee, enjoying a hearty lunch, or treating yourself to a delightful dessert, food is a celebration of life.",
        },
      ],
      image: "/1.jpg",
    },
    {
      category: "Dessert",
      title: "Sweet Treats for Every Occasion",
      subtitle: "Indulging in the world of delightful desserts",
      content: [
        {
          heading: "The Art of Baking",
          text: "Baking is not just a skill; it's an art form. The right balance of ingredients, temperature, and timing creates mouthwatering cakes, cookies, and pastries.",
        },
        {
          heading: "Chocolate: The Ultimate Comfort",
          text: "From dark chocolate truffles to rich chocolate cakes, cocoa-based desserts hold a special place in every sweet lover's heart.",
        },
        {
          heading: "Traditional vs. Modern Desserts",
          text: "Classic desserts like apple pie and crème brûlée continue to stand the test of time, while innovative desserts like matcha lava cake bring a modern twist.",
        },
        {
          heading: "Healthy Desserts: A Guilt-Free Delight",
          text: "Who says desserts can't be healthy? With natural sweeteners, fruits, and whole grains, you can enjoy guilt-free indulgence.",
        },
      ],
      image: "/sec2.jpg",
    },
  ];

  const filteredContent = blogContent.filter(
    (blog) =>
      (category === "All" || blog.category === category) &&
      (search === "" ||
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.subtitle.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.some(
          (section) =>
            section.heading.toLowerCase().includes(search.toLowerCase()) ||
            section.text.toLowerCase().includes(search.toLowerCase())
        ))
  );

  return (
    <div className="relative min-h-screen flex justify-center p-6 text-white bg-cover bg-center bg-[url('/base.jpg')]">
      {/* Darker Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/70 to-black/70"></div>

      {/* Blog Content */}
      <div className="relative max-w-6xl w-full">
        {/* Blog Title */}
        <motion.h1
          className="text-center text-4xl font-bold mt-32 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          BLOGS
        </motion.h1>

        {/* Search & Category Selection */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-b from-blue-800 to-blue-900 p-4 rounded-lg shadow-lg gap-4">
          <input
            type="text"
            placeholder=" Search blog..."
            className="p-2 rounded-full text-black w-full md:w-1/2 border border-gray-300 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 rounded-full text-blue-800 bg-white border border-gray-300 outline-none cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Content Section */}
        {filteredContent.length > 0 ? (
          filteredContent.map((blog, index) => (
            <motion.div
              key={index}
              className="mt-6 bg-white text-black p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 items-stretch"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              {/* Left: Blog Text Content (70%) */}
              <div className="md:w-[65%] flex flex-col flex-1 h-full">
              <span className="bg-blue-300 text-blue-900 px-3 py-1 rounded-lg font-bold text-lg w-[28%] min-w-[120px]">
                Category: {blog.category}
              </span>


                <h2 className="text-3xl font-bold mt-4">{blog.title}</h2>
                <h3 className="text-xl font-semibold text-gray-700">
                  {blog.subtitle}
                </h3>

                {/* Blog Content Box */}
                <div className="bg-[#3a4aa1] text-white p-6 rounded-xl shadow-lg mt-4 flex-1 h-full flex flex-col justify-center">
                  {blog.content.map((section, i) => (
                    <div key={i}>
                      <h2 className="mt-4 font-semibold text-lg">
                        {section.heading}
                      </h2>
                      <p>{section.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Image with Hover Effect */}
              <motion.div
                className="md:w-[35%] flex items-center overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={blog.image}
                  alt={blog.category}
                  className="w-full mt-20 h-[65%] object-cover rounded-lg shadow-md transition duration-300 hover:shadow-2xl"
                />
              </motion.div>
            </motion.div>
          ))
        ) : (
          <motion.p
            className="text-center text-gray-300 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            No results found.
          </motion.p>
        )}
        {/* Back to Home Button */}
        <div className="w-full flex justify-center mt-6">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-800 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#253b9c] hover:scale-105 transition-all duration-300 z-10"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
