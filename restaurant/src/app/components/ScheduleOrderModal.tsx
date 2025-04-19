"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
  spicy_level: string;
  quantity: number;
}

interface ScheduleOrderModalProps {
  item: FoodItem;
  onClose: () => void;
  onAddToCart: (item: FoodItem, quantity: number, specialNote: string) => void;
  scheduledDate: string;
  scheduledTime: string;
  serviceType: string;
}

const ScheduleOrderModal: React.FC<ScheduleOrderModalProps> = ({ item, onClose, onAddToCart, scheduledDate, scheduledTime, serviceType }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2">
      <div className="bg-white w-full max-w-md md:max-w-5xl h-[90%] md:h-[80%] rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition z-10"
        >
          <IoMdClose size={22} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 max-h-[50vh] md:max-h-full overflow-hidden">
          <div className="w-full h-full">
            <img
              src={item.image_url || "/placeholder.jpg"}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-between overflow-auto max-h-[50vh] md:max-h-[90vh]">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {item.name}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              {item.description}
            </p>

            <div className="mt-3">
              <span className="text-sm font-semibold text-gray-700">
                Service Type:
              </span>{" "}
              <span className="text-blue-600 font-bold uppercase text-sm">
                {serviceType}
              </span>
            </div>

            <div className="mt-3">
              <label className="text-sm font-semibold text-gray-700">
                Special Instructions
              </label>
              <textarea
                placeholder="Leave a note"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 text-sm"
                rows={3}
                value={specialNote}
                onChange={(e) => setSpecialNote(e.target.value)}
              ></textarea>
            </div>

            <div className="mt-2">
              <p className="text-sm">Scheduled Date: {scheduledDate}</p>
              <p className="text-sm">Scheduled Time: {scheduledTime}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="bg-gray-300 text-gray-900 px-3 py-1 rounded-md text-lg font-bold"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-lg font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-lg font-bold text-gray-800">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(item, quantity, specialNote);
                onClose();
              }}
              className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded-lg text-base hover:bg-blue-500 transition"
            >
              Add to Scheduled Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleOrderModal;