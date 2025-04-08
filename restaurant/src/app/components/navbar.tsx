"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, Facebook, Youtube, MoreHorizontal } from "lucide-react";
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram, FaUser } from 'react-icons/fa';
import Link from "next/link";

export default function Navbar() {
  const [, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [extraLinks, setExtraLinks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1280); // Mobile menu should activate at 1280px
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Check on first render

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [lastScrollY]);

  
  return (
<header className="fixed top-0 left-0 w-full text-white z-50 backdrop-blur-lg bg-black/75">

      {/* Top Contact & Social Media Bar */}
      <div className="hidden lg:flex justify-between items-center px-6 py-2 text-base font-medium">
    <div className="flex items-center space-x-5">
        <span>📞 0422 306 777</span>
        <span>✉ bluemoon@gmail.com</span>
    </div>
    {/* Social Media & Admin Icons (Right-Aligned) */}
    <div className="flex items-center flex-row-reverse">
        <div className="ml-10">
            <Link href="/admin">
                <FaUser className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </Link>
        </div>
        <div className="flex space-x-3">
            <a href="/QRCode.jpg" target="_blank" rel="noopener noreferrer"> {/* WhatsApp link to QR code */}
                <FaWhatsapp className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </a>
            <Link href="https://www.facebook.com/bluemmoonrestaurant/" target="_blank"><Facebook className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" /></Link>
            <Link href="https://www.youtube.com/@metromtv" target="_blank"><Youtube className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" /></Link>
            <a href="https://www.instagram.com/bluemoonrestaurant1/" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform duration-200" />
            </a>
        </div>
    </div>
</div>

      {/* Navbar Section */}
      <nav className="py-4 shadow-md px-6 flex justify-between items-center">
        {/* Logo and Text */}
        <div className="flex items-center gap-4">
          <Image src="/LOGO.jpg" alt="Bluemoon Logo" width={65} height={65} className="rounded-full" />
          <div className="leading-tight text-left">
            <h1 className="text-[1.65rem] font-medium uppercase tracking-wide text-blue-600 drop-shadow-md animate-slide-in">
              BLUEMOON
            </h1>
            <p className="text-[1.6rem] font-medium uppercase tracking-wide text-gray-300 drop-shadow-md animate-slide-in">
              RESTAURANT
            </p>
          </div>


        </div>

        {/* Desktop Navbar (Only visible if screen width > 1280px) */}
        {!isMobile && (
          <ul className="flex space-x-6 text-lg font-medium items-center">
            <li className="cursor-pointer hover:text-gray-300"><Link href="/">Home</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/menu">Menu</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/about">About Us</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/delivery">Delivery</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/gallery">Gallery</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/cooking">Cooking Videos</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/contact">Contact Us</Link></li>
            <li className="cursor-pointer hover:text-gray-300"><Link href="/table">Table Reservation</Link></li>

            {/* Extra Links Toggle */}
            {extraLinks && (
              <>
                <li className="cursor-pointer hover:text-gray-300"><Link href="/blog">Blog</Link></li>
                <li className="cursor-pointer hover:text-gray-300"><Link href="/order">Online Order</Link></li>
                
              </>
            )}

          
            {/* More Options Toggle Button */}
            <button onClick={() => setExtraLinks(!extraLinks)} className="cursor-pointer ml-4">
              <MoreHorizontal
                className={`w-6 h-6 text-white transition-transform duration-200 ${
                  extraLinks ? "text-gray-400" : "hover:scale-110"
                }`}
              />
            </button>
          </ul>
        )}

        {/* Mobile Menu Button (Appears at width ≤ 1280px) */}
        {isMobile && (
          <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
      </nav>

      {menuOpen && isMobile && (
  <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black/90 to-black/90 backdrop-blur-lg p-6 z-50">
    {/* Logo & Close Button */}
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <Image src="/LOGO.jpg" alt="Bluemoon Logo" width={55} height={55} className="rounded-full" />
        <div>
          <h1 className="text-xl font-bold tracking-wide">BLUEMOON</h1>
          <p className="text-sm tracking-wider">RESTAURANT</p>
        </div>
      </div>
      <button onClick={() => setMenuOpen(false)} className="text-white">
        <X className="w-6 h-6" />
      </button>
    </div>

    {/* Navigation Links */}
    <ul className="flex flex-col items-center space-y-4 text-lg font-medium">
      {[
        { href: "/", label: "Home" },
        { href: "/menu", label: "Menu" },
        { href: "/about", label: "About Us" },
        { href: "/delivery", label: "Delivery" },
        { href: "/cooking", label: "Cooking Videos" },
        { href: "/blog", label: "Blog" },
        { href: "/gallery", label: "Gallery" },
        { href: "/table", label: "Table Reservation" },
        { href: "/contact", label: "Contact Us" },
        { href: "/order", label: "Online Order" },
      ].map((item) => (
        <li
          key={item.href}
          onClick={() => setMenuOpen(false)}
          className="cursor-pointer border-b border-white/20 pb-2 w-full text-center"
        >
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  </div>
)}
    </header>
  );
}