"use client";

import { useState } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

// Define User Type
type User = {
  name: string;
  email: string;
  password: string;
};

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [userData, setUserData] = useState<User>({ name: "", email: "", password: "" });

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get existing users from localStorage
    const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if the user already exists
    if (storedUsers.some((user) => user.email === userData.email)) {
      alert("User already registered. Please login.");
      setIsLogin(true);
      return;
    }

    // Store new user
    const updatedUsers: User[] = [...storedUsers, userData];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    alert("Registration successful! You can now log in.");
    setIsLogin(true); // Switch to login mode
    setUserData({ name: "", email: "", password: "" }); // Reset form
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Get users from localStorage
    const storedUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Find user
    const user = storedUsers.find((user) => user.email === userData.email && user.password === userData.password);

    if (user) {
      alert(`Welcome, ${user.name}!`);
      localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store logged-in user
      // Redirect or navigate to another page if needed
    } else {
      alert("Invalid credentials or user not registered.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminUserSidebar />
      <div className="flex-1 flex items-center justify-center text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-blue-900">
            {isLogin ? "🔑 Login" : "🏷️ Register"}
          </h1>

          <form className="mt-6 space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                value={userData.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={userData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={userData.password}
              onChange={handleChange}
              required
            />

            <button className="w-full bg-blue-800 text-white py-2 rounded hover:opacity-80">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <p className="mt-4 text-gray-600">
            {isLogin ? "New user?" : "Already have an account?"}{" "}
            <span className="text-blue-600 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
