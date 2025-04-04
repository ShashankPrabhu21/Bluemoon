
"use client";

import { useState } from "react";

export default function ReservationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    fromTime: "",
    toTime: "",
    guests: "",
    tableNumber: "",
    offers: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    alert(result.message);

    if (result.success) {
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        fromTime: "",
        toTime: "",
        guests: "",
        tableNumber: "",
        offers: false,
      });
    }

    setLoading(false);
  };
  
  return (
    <div className="bg-gray-100 p-8 rounded-xl shadow-2xl w-full max-w-xl">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">RESERVE A TABLE</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex space-x-4">
          <input
            type="text" name="name" placeholder="Name" required
            className="w-1/2 p-3 border rounded-lg text-lg" value={formData.name} onChange={handleChange}
          />
          <input
            type="tel" name="phone" placeholder="Phone" required
            className="w-1/2 p-3 border rounded-lg text-lg" value={formData.phone} onChange={handleChange}
          />
        </div>

        <input
          type="email" name="email" placeholder="Email" required
          className="w-full p-3 border rounded-lg text-lg" value={formData.email} onChange={handleChange}
        />

        <div className="flex space-x-4">
          <input
            type="date" name="date" required
            className="w-1/2 p-3 border rounded-lg text-lg" value={formData.date} onChange={handleChange}
          />

          <select
            name="guests" required className="w-1/2 p-3 border rounded-lg text-lg text-gray-500"
            value={formData.guests} onChange={handleChange}
          >
            <option value="" disabled>No of guests</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i + 1}>{i + 1}</option>
            ))}
            <option value="10+">10+</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <input
            type="time" name="fromTime" required
            className="w-1/2 p-3 border rounded-lg text-lg" value={formData.fromTime} onChange={handleChange}
          />
          <input
            type="time" name="toTime" required
            className="w-1/2 p-3 border rounded-lg text-lg" value={formData.toTime} onChange={handleChange}
          />
        </div>

        <div>
          <select
            name="tableNumber" required className="w-full p-3 border rounded-lg text-lg text-gray-500"
            value={formData.tableNumber} onChange={handleChange}
          >
            <option value="" disabled>Select table</option>
            {[...Array(8)].map((_, i) => (
              <option key={i} value={`Table ${i + 1}`}>Table {i + 1}</option> // Store "Table 1" instead of just 1.
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg text-gray-700">Send me special offers and updates.</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="offers"
              checked={formData.offers}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-blue-700 peer-checked:after:translate-x-5 
              after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full 
              after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>

        <button
          type="submit"
          className={`w-full p-3 bg-blue-900 text-white rounded-lg text-lg hover:bg-blue-800 
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Reserve Now"}
        </button>
      </form>

    </div>
  );
}