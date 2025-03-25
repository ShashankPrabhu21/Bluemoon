"use client";

import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

interface FoodItem {
  id: number;
  foodName: string;
  price: number;
  image: string;
  quantity?: number;
  specialNote?: string;
}

const CartPage = () => {
  const [cart, setCart] = useState<FoodItem[]>([]);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("delivery");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      const storedOrderType = localStorage.getItem("orderType");
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedOrderType) setOrderType(storedOrderType as "pickup" | "delivery");
    }
  }, []);

  const handleOrderTypeChange = (type: "pickup" | "delivery") => {
    setOrderType(type);
    localStorage.setItem("orderType", type);
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem("cartItems");
    setCart([]);
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const discount = orderType === "pickup" ? totalAmount * 0.1 : 0;
  const deliveryCharge = orderType === "delivery" ? 0 : 0; // Example: $5 delivery charge
  const finalTotal = totalAmount - discount + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-100 p-8 mt-32">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">ORDER DETAILS</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Your cart is empty.</p>
          <Link
            href="/viewMenu"
            className="text-blue-600 mt-4 inline-block text-lg font-semibold hover:underline"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border-b bg-gray-50 rounded-lg shadow-sm"
              >
                <img src={item.image} alt={item.foodName} className="w-20 h-20 rounded-md object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{item.foodName}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                  {item.specialNote && (
                    <p className="text-sm italic text-gray-500">Note: {item.specialNote}</p>
                  )}
                  <p className="text-lg font-bold text-blue-600">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <IoClose size={24} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Type Selection */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Order Type</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => handleOrderTypeChange("pickup")}
                className={`w-1/2 py-3 text-lg font-medium rounded-lg transition shadow-md ${
                  orderType === "pickup" ? "bg-blue-600 text-gray-100" : "bg-gray-300 text-gray-700"
                }`}
              >
                PICKUP
              </button>
              <button
                onClick={() => handleOrderTypeChange("delivery")}
                className={`w-1/2 py-3 text-lg font-medium rounded-lg transition shadow-md ${
                  orderType === "delivery" ? "bg-blue-600 text-gray-100" : "bg-gray-300 text-gray-700"
                }`}
              >
                DELIVERY
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
              <span>Sub-Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            {orderType === "pickup" && (
              <div className="flex justify-between text-lg text-green-600 px-2 py-2">
                <span>Discount (Pickup -10%):</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            {orderType === "delivery" && (
              <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
                <span>Delivery Charge:</span>
                <span>${deliveryCharge.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-2xl font-bold text-gray-900 px-2 py-3 bg-gray-100 rounded-md shadow">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Buttons */}
          <Link href="/checkout">
            <button className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md">
              Proceed to Checkout
            </button>
          </Link>

          <button
            onClick={clearCart}
            className="w-full mt-3 py-3 text-white font-medium bg-red-500 hover:bg-red-400 rounded-lg transition text-lg shadow-md"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Back Button (Centered at Bottom) */}
      <div className="flex justify-center mt-8">
        <Link
          href="/viewMenu"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition"
        >
          Add More Items
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
