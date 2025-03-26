"use client";

import React from "react";
import Link from "next/link";
import { FaUtensils, FaClock } from "react-icons/fa";

const OrderSelectionPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Order Now</h1>
        <p className="text-gray-600 mb-6 text-lg">Choose how you&apos;d like to place your order.</p>
        
        <div className="space-y-5">
          <Link href="/viewMenu">
            <button className="mb-3 cursor-pointer w-full flex items-center justify-center gap-3 py-4 bg-[#3345A7] text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-[#2c3b8e] transition-all duration-300 transform hover:scale-105">
              <FaUtensils className="text-2xl" /> View Menu
            </button>
          </Link>
          <Link href="/schedule">
          <button
            className="w-full flex items-center justify-center gap-3 py-4 bg-gray-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
          >
            <FaClock className="text-2xl" /> Schedule for Later
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSelectionPage;
