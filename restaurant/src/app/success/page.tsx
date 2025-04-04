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
    <div className="flex items-center justify-center min-h-screen px-4 mt-[140px] bg-gray-100 mb-12">
      <div className="relative bg-[#1E3A8A] text-white shadow-lg rounded-xl p-8 max-w-xl w-full text-center border border-gray-700">
        {/* Success Icon */}
        <FaCheckCircle className="text-green-400 text-6xl mb-4 mx-auto drop-shadow-lg" />
        
        {/* Title & Message */}
        <h1 className="text-3xl font-semibold mb-3">Payment Successful</h1>
        <p className="text-sm text-gray-200 mb-6">
          Thank you for your order! It&apos;s being processed and will be delivered soon.
        </p>

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <h3 className="text-lg font-medium text-white mb-2">🛒 Order Summary</h3>
          <ul className="divide-y divide-gray-500/50">
            {cart.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.food_name} className="w-12 h-12 rounded-lg shadow-md" />
                  <span className="text-gray-100 text-sm font-medium">{item.food_name} × {item.quantity}</span>
                </div>
                <span className="text-green-300 font-semibold text-md">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Details */}
        <div className="mt-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <h3 className="text-md font-medium text-white">💳 Payment Details</h3>
          <p className="text-gray-200 text-sm">
            Payment Method: <span className="font-medium capitalize text-orange-400">{paymentMethod.replace("-", " ")}</span>
          </p>
        </div>

        {/* Pricing Details */}
        <div className="mt-6 bg-gradient-to-r from-[#1A2E66] to-[#203A8E] px-6 py-4 rounded-lg text-left shadow-lg shadow-blue-500/30 border border-blue-400/50">
          <div className="flex justify-between text-sm text-gray-200">
            <span>Sub-Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {serviceType === "delivery" && (
            <div className="flex justify-between text-sm text-gray-200">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between text-lg font-semibold text-white px-3 py-2 bg-gradient-to-r from-[#203A8E] to-[#203A8E] rounded-md shadow">
            <span>Total Paid:</span>
            <span className="text-yellow-400 font-bold text-2xl">${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Back Button */}
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
