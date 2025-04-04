"use client";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

interface CartItem {
  price: number;
  quantity: number;
  food_name: string;
  image: string;
}

export default function SuccessPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [finalTotal, setFinalTotal] = useState(0);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    city: "",
    state: "",
    postCode: "",
  });

  useEffect(() => {
    // Fetch order details (from localStorage, API, etc.)
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const storedServiceType = localStorage.getItem("serviceType") || null;
    const storedPaymentMethod = localStorage.getItem("paymentMethod") || "credit-card";
    const storedDeliveryInfo = JSON.parse(localStorage.getItem("deliveryInfo") || "{}");
    const storedDiscount = parseFloat(localStorage.getItem("discount") || "0");

    setCart(storedCart);
    setServiceType(storedServiceType);
    setPaymentMethod(storedPaymentMethod);
    setDeliveryInfo(storedDeliveryInfo);
    setDiscount(storedDiscount);

    const total = storedCart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    setTotalAmount(total);
    setDeliveryCharge(storedServiceType === "delivery" ? 5 : 0);
  }, []);

  useEffect(() => {
    setFinalTotal(totalAmount + deliveryCharge - discount);
  }, [totalAmount, deliveryCharge, discount]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4 mt-20">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <FaCheckCircle className="text-green-500 text-7xl mb-5 mx-auto drop-shadow-lg" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-md text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>

        {/* Order Summary */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg text-left shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🛒 Order Summary</h3>
          <ul className="divide-y divide-gray-300">
            {cart.map((item, index) => (
              <li key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.food_name} className="w-10 h-10 rounded-lg" />
                  <span className="text-gray-900 font-medium">{item.food_name} x{item.quantity}</span>
                </div>
                <span className="text-green-700 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery Address */}
        {serviceType === "delivery" && (
          <div className="mt-6 bg-gray-100 p-4 rounded-lg text-left">
            <h3 className="text-lg font-semibold text-gray-800">📍 Delivery Address</h3>
            <p className="text-gray-600">{deliveryInfo.address}, {deliveryInfo.city}, {deliveryInfo.state}, {deliveryInfo.postCode}</p>
          </div>
        )}

        {/* Payment Details */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg text-left shadow">
          <h3 className="text-lg font-semibold text-gray-800">💳 Payment Details</h3>
          <p className="text-gray-700">Payment Method: <span className="font-medium capitalize">{paymentMethod.replace("-", " ")}</span></p>
        </div>

        {/* Pricing Details */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
            <span>Sub-Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          {serviceType === "delivery" && (
            <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
              <span>Delivery Charge:</span>
              <span>${deliveryCharge.toFixed(2)}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-lg text-green-700 px-2 py-2">
              <span>Discount Applied:</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-2xl font-bold text-gray-900 px-2 py-3 bg-gray-100 rounded-md shadow">
            <span>Total Paid:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium px-6 py-3 rounded-full shadow-md mt-6"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
