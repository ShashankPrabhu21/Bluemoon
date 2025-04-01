"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe");

    if (savedRememberMe === "true" && savedUsername && savedPassword) {
      setCredentials({ username: savedUsername, password: savedPassword });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const validUsernames = ["admin", "ADMIN"];
    const validPasswords = ["admin123", "ADMIN123"];

    if (!credentials.username.trim() && !credentials.password.trim()) {
      alert("Please enter username and password");
    } else if (!credentials.username.trim()) {
      alert("Please enter your username");
    } else if (!credentials.password.trim()) {
      alert("Please enter your password");
    } else if (!validUsernames.includes(credentials.username)) {
      alert("Invalid Username");
    } else if (!validPasswords.includes(credentials.password)) {
      alert("Invalid Password");
    } else {
      if (rememberMe) {
        localStorage.setItem("username", credentials.username);
        localStorage.setItem("password", credentials.password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }
      router.push("/adminDashboard");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-800">Admin Login</h2>
        <form onSubmit={handleLogin} className="mt-6">
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 text-gray-700 outline-none transition-all duration-300"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="relative mt-4">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 text-gray-700 outline-none transition-all duration-300"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <div className="flex justify-between items-center mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember Me
            </label>
            <button
              type="button"
              className="text-blue-800 hover:text-blue-800 hover:underline text-sm transition-all duration-300"
              onClick={() => alert("Forgot password functionality here")}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full mt-5 bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-5">
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}