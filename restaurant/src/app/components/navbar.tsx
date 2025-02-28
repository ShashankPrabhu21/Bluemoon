"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Facebook, Youtube, Instagram } from "lucide-react";

export default function Navbar() {
  const [showMore, setShowMore] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollThresholdReached, setScrollThresholdReached] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if user has scrolled more than one viewport height
      if (currentScrollY > window.innerHeight) {
        setScrollThresholdReached(true);
      } else {
        setScrollThresholdReached(false);
      }

      if (scrollThresholdReached) {
        if (currentScrollY < lastScrollY) {
          // User is scrolling up -> Show Navbar
          setIsVisible(true);
        } else {
          // User is scrolling down -> Hide Navbar
          setIsVisible(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, scrollThresholdReached]);

  return (
    <header
      className={`fixed top-0 left-0 right-5 text-white z-50 transition-transform duration-500 ease-in-out backdrop-blur-lg
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${scrollThresholdReached ? "bg-black" : "bg-black/25"}
      `}
    >

    {/* Header Content */}
    <div className="flex flex-col w-full">
    
    {/* Top Contact & Social Media Bar */}
    <div className="flex justify-between items-center px-6 py-2 text-base font-medium">
      {/* Contact Details */}
      <div className="flex items-center space-x-5">
        <span>📞 0422 306 777</span>
        <span>✉ bluemoon@gmail.com</span>
      </div>

      {/* Social Icons */}
      <div className="flex space-x-5">
        <Facebook className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
        <Youtube className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
        <Instagram className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
      </div>
    </div>



    {/* Navbar Section */}
    <nav className="py-4 shadow-md px-6 flex justify-between items-center">
      
      {/* Logo and Text */}
      <div className="flex items-center gap-2">
        <Image
          src="/LOGO.jpg"
          alt="Bluemoon Logo"
          width={65}
          height={65}
          className="rounded-full"
        />
        <div className="leading-tight">
          <h1 className="text-2xl font-bold tracking-wide">BLUEMOON</h1>
          <p className="text-sm tracking-wider">RESTAURANT</p>
        </div>
      </div>

      {/* Navbar Links */}
      <ul className="hidden md:flex space-x-6 text-lg font-medium">
        <li className="cursor-pointer hover:text-gray-300">Home</li>
        <li className="cursor-pointer hover:text-gray-300">Menu</li>
        <li className="cursor-pointer hover:text-gray-300">Delivery</li>
        <li className="cursor-pointer hover:text-gray-300">Cooking Videos</li>
        <li className="cursor-pointer hover:text-gray-300">Blog</li>
        <li className="cursor-pointer hover:text-gray-300">Gallery</li>
        <li className="cursor-pointer hover:text-gray-300">Table Reservations</li>
        {showMore && (
          <>
            <li className="cursor-pointer hover:text-gray-300">Contact</li>
            <li className="cursor-pointer hover:text-gray-300">Pick Up</li>
          </>
        )}
        <li className="cursor-pointer" onClick={() => setShowMore(!showMore)}>
          <Menu className="w-6 h-6" />
        </li>
      </ul>

    </nav>
  </div>
</header>
  );
}