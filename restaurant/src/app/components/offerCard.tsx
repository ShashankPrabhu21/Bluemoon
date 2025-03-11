import React from "react";

interface OfferItemProps {
  image: string;
  name: string;
  price: string;
  token: string;
}

const OfferItem: React.FC<OfferItemProps> = ({ image, name, price, token }) => {
  return (
<div className="w-56 bg-gradient-to-b from-[#3b4e7c] to-[#9cb7ff]
 text-white rounded-xl overflow-hidden shadow-xl p-3 transition-all duration-300 hover:shadow-2xl">
  
  {/* Title */}
  <h3 className="h-10 flex items-center justify-center text-center font-bold text-lg tracking-wide">
    {name}
  </h3>

  {/* Image Section */}
  <div className="flex justify-center items-center mt-3">
    <div className="w-36 h-36 bg-black rounded-full flex items-center justify-center shadow-md">
      <img src={image} alt={name} className="w-28 h-28 object-contain rounded-full" />
    </div>
  </div>

  {/* Pricing Details */}
  <div className="w-full bg-gradient-to-b from-[#3f56a9] to-[#000000] text-white p-3 mt-3 rounded-xl shadow-lg flex flex-col items-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <p className="text-xs font-semibold tracking-wider text-gray-200">ACTUAL PRICE</p>
    <p className="text-3xl font-extrabold text-yellow-300 mt-0 drop-shadow-lg">${price}</p>
    <div className="text-sm font-bold w-7 h-7 flex items-center justify-center bg-black text-white rounded-full mt-2 shadow-md border-2 border-white">
      {token}
    </div>
  </div>
</div>


  );
};

export default OfferItem;
