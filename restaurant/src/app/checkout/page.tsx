"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const CheckoutPage = () => {
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("delivery");
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    locationPin: "",
    floorUnit: "",
    street: "",
    city: "",
    state: "",
    postCode: "",
  });

  interface CartItem {
    price: number;
    quantity?: number;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrderType = localStorage.getItem("orderType");
      const storedCart = localStorage.getItem("cartItems");

      if (storedOrderType) setOrderType(storedOrderType as "pickup" | "delivery");

      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        const total = cartItems.reduce((acc: number, item: CartItem) => acc + item.price * (item.quantity || 1), 0);
        setTotalAmount(total);
      }
    }
  }, []);

  const discount = orderType === "pickup" ? totalAmount * 0.1 : 0;
  const deliveryCharge = orderType === "delivery" ? 0 : 0; // Adjust delivery charge as needed
  const finalTotal = totalAmount - discount + deliveryCharge;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-32">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">

      {/* Sign-in Options */}
      <div className="max-w-xl mx-auto space-y-4">
        <button className="flex items-center justify-center w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition">
          <FcGoogle className="mr-2 text-2xl" /> SIGN IN WITH GOOGLE
        </button>
        <button className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition">
          LOGIN WITH EMAIL
        </button>
        <button className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition">
          PROCEED AS GUEST
        </button>
      </div>

      {/* Delivery Information Section (Visible for Delivery Orders) */}
      {orderType === "delivery" && (
        <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Location Pin"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.locationPin}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, locationPin: e.target.value })}
            />
            <input
              type="text"
              placeholder="Floor/Unit No (Optional)"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.floorUnit}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, floorUnit: e.target.value })}
            />
            <input
              type="text"
              placeholder="Street Number & Street Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.street}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, street: e.target.value })}
            />
            <input
              type="text"
              placeholder="Town / City / Suburb"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.city}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.state}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })}
            />
            <input
              type="text"
              placeholder="Post Code"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={deliveryInfo.postCode}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postCode: e.target.value })}
            />
          </div>

        </div>
      )}

      {/* Order Summary */}
      <div className="max-w-xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Order Type:
          <span className="ml-2 text-yellow-600 capitalize">{orderType}</span>
        </h2>

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

        {/* Place Order Button */}
        <button className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md">
          Proceed To Payment
        </button>
      </div>

      {/* Back to Cart Button */}
      <div className="flex justify-center mt-8">
        <Link
          href="/cart"
          className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition flex items-center"
        >
          <IoChevronBack className="mr-2" /> Back to Cart
        </Link>
      </div>
    </div>
    </div>
  );
};

export default CheckoutPage;
