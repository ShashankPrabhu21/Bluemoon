"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center relative bg-blue-900 overflow-hidden">
      {/* Subtle Blue Gradient Highlights */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-blue-700/30 rounded-full blur-3xl bottom-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-blue-600/40 rounded-full blur-2xl top-20 right-10"></div>
      </div>

      {/* White Top Section */}
      <div className="w-full h-[100px] bg-white"></div>

      {/* Search Bar */}
      <div className="relative z-10 w-full max-w-md mt-16">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a location..."
            className="w-full p-4 pl-12 bg-white rounded-full shadow-xl outline-none text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-[#314ec4] transition-all duration-300"
          />
          <Search className="absolute left-4 top-4 text-gray-500" size={22} />
        </div>
      </div>

      {/* Location Cards */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 mt-10 max-w-lg w-full z-10">
        <div className="space-y-6 text-[#314ec4]">
          {/* Location List */}
          {[
            {
              title: "Wentworthville",
              areas: [
                { name: "South-Side", services: "Uber Eats | Menulog" },
                { name: "North-Side", services: "Uber Eats | Doordash" },
              ],
            },
            {
              title: "Homebush",
              areas: [
                { name: "East-Side", services: "Uber Eats | Doordash" },
                { name: "West-Side", services: "Uber Eats | Menulog" },
              ],
            },
            {
              title: "Pendle Hills",
              areas: [
                { name: "North-Side", services: "Uber Eats | Menulog" },
                { name: "South-Side", services: "Uber Eats | Doordash" },
              ],
            },
          ].map((location, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <h2 className="text-2xl font-semibold">{location.title}</h2>
              {location.areas.map((area, i) => (
                <div key={i} className="mt-2">
                  <p className="font-medium">{area.name}</p>
                  <p className="text-gray-600">{area.services}</p>
                  {i !== location.areas.length - 1 && <hr className="my-2" />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="mt-8 mb-4 px-6 py-3 bg-blue-800 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-[#253b9c] hover:scale-105 transition-all duration-300 z-10"
      >
        Back to Home
      </Link>
    </div>
  );
}
