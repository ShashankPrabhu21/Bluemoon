"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Facebook, Youtube, Instagram } from "lucide-react";
import Link from "next/link";


export default function Navbar() {
  const [showMore, setShowMore] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollThresholdReached, setScrollThresholdReached] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > window.innerHeight) {
        setScrollThresholdReached(true);
      } else {
        setScrollThresholdReached(false);
      }

      if (scrollThresholdReached) {
        if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        } else {
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
      className={`fixed top-0 left-0 w-full text-white z-50 transition-transform duration-500 ease-in-out backdrop-blur-lg
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${scrollThresholdReached ? "bg-black" : "bg-black/25"}
      `}
    >
      {/* Top Contact & Social Media Bar */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 text-base font-medium">
        <div className="flex items-center space-x-5">
          <span>📞 0422 306 777</span>
          <span>✉ bluemoon@gmail.com</span>
        </div>
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
            <p className="text-sm tracking-wider"> RESTAURANT</p>
          </div>
        </div>

        {/* Navbar Links */}
        <ul className="hidden md:flex space-x-6 text-lg font-medium">
          <li className="cursor-pointer hover:text-gray-300"><Link href="/">Home</Link></li>
          <li className="cursor-pointer hover:text-gray-300">Menu</li>
          <li className="cursor-pointer hover:text-gray-300">
            <Link href="/about">About Us</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-300">Delivery</li>
          <li className="cursor-pointer hover:text-gray-300">Cooking Videos</li>
          <li className="cursor-pointer hover:text-gray-300">Blog</li>
          <li className="cursor-pointer hover:text-gray-300">Gallery</li>
          <li className="cursor-pointer hover:text-gray-300"><Link href="/table">Table Reservation</Link></li>
          {showMore && (
            <>
              <li className="cursor-pointer hover:text-gray-300"><Link href="/contact">Contact Us</Link></li>
              <li className="cursor-pointer hover:text-gray-300">Pick Up</li>
            </>
          )}
          <li className="cursor-pointer" onClick={() => setShowMore(!showMore)}>
            <Menu className="w-6 h-6" />
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black text-white p-4 space-y-2 shadow-lg">
          <ul className="flex flex-col items-center text-lg font-medium">
            <li className="cursor-pointer hover:text-gray-300">Home</li>
            <li className="cursor-pointer hover:text-gray-300">Menu</li>
            <li className="cursor-pointer hover:text-gray-300">About Us</li>
            <li className="cursor-pointer hover:text-gray-300">Delivery</li>
            <li className="cursor-pointer hover:text-gray-300">Cooking Videos</li>
            <li className="cursor-pointer hover:text-gray-300">Blog</li>
            <li className="cursor-pointer hover:text-gray-300">Gallery</li>
            <li className="cursor-pointer hover:text-gray-300">Table Reservations</li>
            <li className="cursor-pointer hover:text-gray-300">Contact</li>
            <li className="cursor-pointer hover:text-gray-300">Pick Up</li>
          </ul>
        </div>
      )}
    </header>
  );
}
