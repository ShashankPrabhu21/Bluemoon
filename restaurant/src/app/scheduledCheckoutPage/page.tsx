// ScheduledCheckoutPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";

interface ScheduledCartItem {
  scheduled_cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  scheduled_date: string;
  scheduled_time: string;
  service_type: string;
}

const ScheduledCheckoutPage = () => {
  const [orderType, setOrderType] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchScheduledCartItems = async () => {
      try {
        const res = await fetch("/api/scheduledcart/get");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setOrderType(data[0].service_type);
            const total = data.reduce((acc: number, item: ScheduledCartItem) => acc + item.price * item.quantity, 0);
            setTotalAmount(total);
          }
        } else {
          console.error("Failed to fetch scheduled cart items");
        }
      } catch (error) {
        console.error("Error fetching scheduled cart items:", error);
      }
    };

    fetchScheduledCartItems();
  }, []);

  const discount = orderType === "pickup" ? totalAmount * 0.1 : 0;
  const deliveryCharge = orderType === "delivery" ? 0 : 0;
  const finalTotal = totalAmount - discount + deliveryCharge;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-32">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">

        {/* Order Summary */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
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

        {/* Back to Scheduled Cart Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/scheduledCart"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-900 transition flex items-center"
          >
            <IoChevronBack className="mr-2" /> Back to Scheduled Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScheduledCheckoutPage;