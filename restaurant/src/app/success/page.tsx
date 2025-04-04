"use client";

import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface CartItem {
  price: number;
  quantity: number;
  service_type: string;
  food_name: string;
  image: string;
}

export default function SuccessPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [finalTotal, setFinalTotal] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    postCode: "",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch("/api/cart/get");
        if (res.ok) {
          const cartData = await res.json();
          setCart(cartData);
          if (cartData.length > 0) {
            setServiceType(cartData[0].service_type);
            const total = cartData.reduce(
              (acc: number, item: CartItem) => acc + item.price * item.quantity,
              0
            );
            setTotalAmount(total);
          }
        }

        const paymentRes = await fetch("/api/payment/get");
        if (paymentRes.ok) {
          const paymentData = await paymentRes.json();
          setPaymentMethod(paymentData.method);
        }

        const deliveryRes = await fetch("/api/delivery/get");
        if (deliveryRes.ok) {
          const deliveryData = await deliveryRes.json();
          setDeliveryInfo(deliveryData);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, []);

  useEffect(() => {
    setDeliveryCharge(serviceType === "delivery" ? 5 : 0);
    setFinalTotal(totalAmount + deliveryCharge);
  }, [totalAmount, serviceType]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 mt-32 bg-gray-100">
      <div className="relative bg-[#1E3A8A] text-white shadow-lg rounded-xl p-6 max-w-lg w-full text-center border border-gray-700">
        {/* Success Icon */}
        <FaCheckCircle className="text-green-400 text-6xl mb-4 mx-auto drop-shadow-lg" />
        
        {/* Title & Message */}
        <h1 className="text-2xl font-semibold mb-2">Payment Successful</h1>
        <p className="text-sm text-gray-200 mb-4">
          Thank you for your order! It's being processed and will be delivered soon.
        </p>

        {/* Order Summary */}
        <div className="bg-gradient-to-b from-[#1A2E66] to-[#203A8E] p-4 rounded-lg text-left shadow-sm shadow-blue-300/50 border border-blue-400/30">
          <h3 className="text-md font-medium text-white mb-2">🛒 Order Summary</h3>
          <ul className="divide-y divide-gray-400">
            {cart.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.food_name} className="w-10 h-10 rounded-lg shadow-sm" />
                  <span className="text-gray-100 text-sm font-medium">{item.food_name} × {item.quantity}</span>
                </div>
                <span className="text-green-300 font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery Address */}
        {serviceType === "delivery" && (
          <div className="mt-4 bg-white/20 p-3 rounded-lg text-left shadow-sm">
            <h3 className="text-md font-medium text-white">📍 Delivery Address</h3>
            <p className="text-gray-200 text-sm">
              {deliveryInfo.address}, {deliveryInfo.city}, {deliveryInfo.state}, {deliveryInfo.postCode}
            </p>
          </div>
        )}

        {/* Payment Details */}
        <div className="mt-4 bg-gradient-to-b from-[#1A2E66] to-[#203A8E] p-4 rounded-lg text-left shadow-sm shadow-blue-300/50 border border-blue-400/30">
          <h3 className="text-md font-medium text-white">💳 Payment Details</h3>
          <p className="text-gray-200 text-sm">
            Payment Method: <span className="font-medium capitalize text-orange-500">{paymentMethod.replace("-", " ")}</span>
          </p>
        </div>

        {/* Pricing Details */}
        <div className="mt-4 bg-gradient-to-b from-[#1A2E66] to-[#203A8E] p-4 rounded-lg text-left shadow-sm shadow-blue-300/50 border border-blue-400/30">
          <div className="flex justify-between text-sm text-gray-200 px-2">
            <span>Sub-Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {serviceType === "delivery" && (
            <div className="flex justify-between text-sm text-gray-200 px-2">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between text-lg font-semibold text-white px-2 py-2 bg-gradient-to-b from-[#203A8E] to-[#203A8E] rounded-md shadow">
            <span>Total Paid:</span>
            <span className="text-yellow-500 font-bold text-2xl">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href="/"
          className="inline-block bg-white text-blue-700 font-medium px-6 py-3 rounded-full shadow-md mt-5 text-md border border-white hover:bg-[#1A2E66] hover:text-white transition duration-300"
        >
          ⬅️ Back to Home
        </Link>
      </div>
    </div>
  );
}
