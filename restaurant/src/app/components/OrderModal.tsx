"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string; // Use image_url from your database
  category_id: number;
  quantity:number;
  spicy_level: string;
}

interface OrderModalProps {
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, specialNote: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl h-[90%] rounded-lg shadow-lg flex flex-col overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition"
        >
          <IoMdClose size={22} />
        </button>

        <div className="flex flex-grow">
          <div className="w-[55%] md:w-[60%]">
            <img
              src={item.image_url || "/placeholder.jpg"} // Use image_url with fallback
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[45%] md:w-[40%] p-6 flex flex-col">
            <h2 className="text-3xl font-bold text-gray-900">{item.name}</h2>
            <p className="text-gray-600 mt-2">{item.description}</p>

            <div className="mt-4">
              <label className="text-gray-800 font-semibold">Special Instructions</label>
              <textarea
                placeholder="Leave a note"
                className="w-full mt-2 p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="bg-gray-300 text-gray-900 px-4 py-2 rounded-md text-lg font-bold"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="bg-green-500 text-white px-4 py-2 rounded-md text-lg font-bold"
              >
                +
              </button>
              <span className="text-xl font-bold text-gray-800">${(item.price * quantity).toFixed(2)}</span>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  onAddToCart(item, quantity, specialNote);
                  onClose();
                }}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg text-lg hover:bg-blue-500 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;