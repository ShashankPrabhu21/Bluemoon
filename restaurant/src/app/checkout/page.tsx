"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
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
  const [authOption, setAuthOption] = useState<"email" | "guest" | "signup" | "forgotPassword" | null>(null);
  const [emailLoginInfo, setEmailLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [guestLoginSuccess, setGuestLoginSuccess] = useState<boolean>(false);

  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [forgotPasswordInfo, setForgotPasswordInfo] = useState({
    email: "",
    newPassword: "",
  });
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);

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
        const total = cartItems.reduce(
          (acc: number, item: CartItem) => acc + item.price * (item.quantity || 1),
          0
        );
        setTotalAmount(total);
      }
    }
  }, []);


  const deliveryCharge = orderType === "delivery" ? 0 : 0; // Adjust delivery charge as needed
  const finalTotal = totalAmount + deliveryCharge;

 

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/loginIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailLoginInfo),
      });

      if (response.ok) {
        console.log("Login successful");
        setAuthError(null);
        setLoginSuccess(true);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setAuthError(errorData.error || "Account does not exist or invalid credentials.");
        } else {
          setAuthError(errorData.error || "Failed to login.");
        }
        setLoginSuccess(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Failed to login.");
      setLoginSuccess(false);
    }
  };

  const handleGuestSubmit = async () => {
    try {
      const response = await fetch("/api/guestOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guestInfo),
      });

      if (response.ok) {
        setGuestLoginSuccess(true);
        setLoginSuccess(true);
      } else {
        const errorData = await response.json();
        setAuthError(errorData.error || "Failed to save guest info.");
      }
    } catch (error) {
      console.error("Guest info error:", error);
      setAuthError("Failed to save guest info.");
    }
  };

  const handleProceedToPayment = () => {
    if (!loginSuccess && !signupSuccess) {
      alert("Please login or signup first.");
      return;
    }

    setAuthError(null);
    // Proceed to payment logic here
    console.log("Proceeding to payment...");
     // If all conditions are met, redirect to the Stripe payment link
     window.location.href = "https://buy.stripe.com/test_3cs7vB6NI5xlgkU6oo";
    
  };

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(forgotPasswordInfo),
      });

      if (response.ok) {
        setForgotPasswordMessage("Successfully created!");
      } else {
        try {
          const errorData = await response.json();
          setForgotPasswordMessage(errorData.error || "Account not found.");
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            console.error("Server returned HTML:", errorText);
            setForgotPasswordMessage("An unexpected error occurred. Please try again.");
          } catch (textError) {
            console.error("Failed to parse both JSON and text:", jsonError, textError);
            setForgotPasswordMessage("An unexpected error occurred. Please try again.");
          }
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setForgotPasswordMessage("An error occurred.");
    }
  };

  const handleSignup = async () => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      if (response.ok) {
        setSignupSuccess(true);
      } else {
        const errorData = await response.json();
        setAuthError(errorData.error || "Failed to create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setAuthError("Failed to create account.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-32">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">

        {authOption === null ? (
          <div className="max-w-xl mx-auto space-y-4">
            <button
              className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={() => setAuthOption("email")}
            >
              LOGIN WITH EMAIL
            </button>
            <button
              className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={() => setAuthOption("guest")}
            >
              PROCEED AS GUEST
            </button>
          </div>
        ) : authOption === "email" ? (
          <div className="max-w-xl mx-auto space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={emailLoginInfo.email}
              onChange={(e) => setEmailLoginInfo({ ...emailLoginInfo, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={emailLoginInfo.password}
              onChange={(e) => setEmailLoginInfo({ ...emailLoginInfo, password: e.target.value })}
            />
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setAuthOption("forgotPassword")}
            >
              Forgot Password?
            </button>
            <button
              className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={handleLogin}
            >
              Login
            </button>
            {authError && <p className="text-red-500 mt-2">{authError}</p>}
            {loginSuccess && <p className="text-green-500 mt-2">Login successful</p>}
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setAuthOption("signup")}>
                Create one
              </button>
            </p>
          </div>
        ) : authOption === "guest" ? (
          <div className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={guestInfo.firstName}
              onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={guestInfo.lastName}
              onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={guestInfo.mobileNumber}
              onChange={(e) => setGuestInfo({ ...guestInfo, mobileNumber: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={guestInfo.email}
              onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
            />
            <button
              className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={handleGuestSubmit}
            >
              Submit
            </button>
            {guestLoginSuccess && <p className="text-green-500 mt-2">Login successful</p>}
            {authError && <p className="text-red-500 mt-2">{authError}</p>}
          </div>
        ) : authOption === "signup" ? (
          <div className="max-w-xl mx-auto space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.firstName}
              onChange={(e) => setSignupInfo({ ...signupInfo, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.lastName}
              onChange={(e) => setSignupInfo({ ...signupInfo, lastName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.email}
              onChange={(e) => setSignupInfo({ ...signupInfo, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.password}
              onChange={(e) => setSignupInfo({ ...signupInfo, password: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.confirmPassword}
              onChange={(e) => setSignupInfo({ ...signupInfo, confirmPassword: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={signupInfo.phoneNumber}
              onChange={(e) => setSignupInfo({ ...signupInfo, phoneNumber: e.target.value })}
            />
            <button
              className="w-full bg-green-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-green-900 transition"
              onClick={handleSignup}
            >
              Sign Up
            </button>
            {signupSuccess && <p className="text-green-500 mt-2">Successfully created!</p>}
          </div>
        ) : authOption === "forgotPassword" ? (
          <div className="max-w-xl mx-auto space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={forgotPasswordInfo.email}
              onChange={(e) => setForgotPasswordInfo({ ...forgotPasswordInfo, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={forgotPasswordInfo.newPassword}
              onChange={(e) => setForgotPasswordInfo({ ...forgotPasswordInfo, newPassword: e.target.value })}
            />
            <button
              className="w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={handleForgotPassword}
            >
              Change Password
            </button>
            {forgotPasswordMessage && (
              <p
                className={`mt-4 text-center ${
                  forgotPasswordMessage === "Successfully created!" ? "text-green-500" : "text-red-500"
                }`}
              >
                {forgotPasswordMessage}
              </p>
            )}
          </div>
        ) : null}

        {/* Delivery Information Section (Visible for Delivery Orders) */}
        {orderType === "delivery" && (
          <div className="max-w-3xl mx-auto mt-6 bg-white p-6 rounded -lg shadow-sm">
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
          <h2 className="text-xl font-bold mb-2">
            Order Type: <span className="ml-2 text-yellow-600 capitalize">{orderType}</span>
          </h2>

          {/* Price Breakdown */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between text-lg text-gray-900 px-2 py-2">
              <span>Sub-Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            
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
          <button
            className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md"
            onClick={handleProceedToPayment}
          >
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