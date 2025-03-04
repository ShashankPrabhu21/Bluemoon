"use client";

import ReservationForm from "../components/ResevationForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TablePage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/base1.jpg')",
      }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/60"></div>

      {/* Content Wrapper to Ensure Proper Layering */}
      <div className="relative z-10 flex flex-col items-center mt-32 ">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text 
          bg-gradient-to-b from-gray-100 to-gray-300 tracking-wide drop-shadow-md 
          animate-fadeIn">
          TABLE RESERVATION
        </h1>


        <div className="bg-gradient-to-b from-gray-200 to-blue-100 bg-opacity-90 
                        p-8 rounded-lg shadow-lg w-full max-w-xl mt-8">
          <ReservationForm />
        </div>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-4 mb-4 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Back to Home
        </button>
       
      </div>
      
    </div>
    
  );
}
