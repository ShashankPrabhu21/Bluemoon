// ScheduledCheckoutPage.tsx
"use client";

import React, { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

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
  const [authOption, setAuthOption] = useState<"google" | "email" | "guest" | "signup" | "forgotPassword" | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
  });
  const [emailLoginInfo, setEmailLoginInfo] = useState({
    email: "",
    password: "",
  });
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
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<boolean>(false);
  const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchScheduledCartItems = async () => {
      try {
        const res = await fetch("/api/scheduledcart/get");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setOrderType(data[0].service_type);
            const total = data.reduce(
              (acc: number, item: ScheduledCartItem) => acc + item.price * item.quantity,
              0
            );
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

  const handleGoogleSignIn = () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?response_type=code&client_id=27035243415-m9eqo7qhnm5d9752jcu4p421p5p6ht6f.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fonecorner-customer-production.firebaseapp.com%2F__%2Fauth%2Fhandler&state=AMbdmDk1GOC9zDUcUVrNK5FXC4aGSB21-UfXDFleKoMIxPBeONdOJv03tv7Sx9MXfhYiDr84DWfHafNvlJlYYDtjPM9i53Dxkfu4ajH_OGI1D-UvSzZN3tVKVjR6m_vjMoahAN2qOETyGAH4metpGsszHkfPy6L4h2-hoM2gErcLoKd7g0QhqrHnKiiERY0woEYW8oBOq2SgaN0ZHt-kdZ3y2UidBbxYcl7WBJ14Q01c2TFUAwTwg2PjGxRdjy65w3W6gdyVZaTHjnyQ1djdOg_SqFk4A-wdjNSUs4xEa3gaUYlLkw2RuPJSZGpOnYU0Bd-mS9CqI_UkZrr1U-hE5WJVCKvKivzv&scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20profile&context_uri=https%3A%2F%2Fonecorner.app&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow";
  };

  const handleProceedToPayment = () => {
    if (!loginSuccess && !signupSuccess) {
      alert("Please login or signup first.");
      return;
    }

    setAuthError(null);
    // Proceed to payment logic here
    console.log("Proceeding to payment...");
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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6 mt-32">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        {authOption === null ? (
          <div className="max-w-xl mx-auto space-y-4">
            <button
              className="flex items-center justify-center w-full bg-blue-700 text-white text-lg font-medium py-3 rounded-lg shadow-md hover:bg-blue-900 transition"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle className="mr-2 text-2xl" /> SIGN IN WITH GOOGLE
            </button>
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
        ) : authOption === "google" ? (
          <div>
            <p>Google Sign-in and User Info</p>
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
              Don`&apos;`t have an account?{" "}
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
                    <p className={`mt-4 text-center ${forgotPasswordMessage === "Successfully created!" ? "text-green-500" : "text-red-500"}`}>
                        {forgotPasswordMessage}
                    </p>
                )}
            </div>
        ) : null}

        {/* Order Summary */}
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-xl font-bold mb-2">
            Order Type: <span className="ml-2 text-yellow-600 capitalize">{orderType}</span>
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
          <button
            className="w-full mt-4 py-3 text-white font-medium bg-green-600 hover:bg-green-500 rounded-lg transition text-lg shadow-md"
            onClick={handleProceedToPayment}
          >
            Proceed To Payment
          </button>
          {authError && <p className="text-red-500 mt-2">{authError}</p>}
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