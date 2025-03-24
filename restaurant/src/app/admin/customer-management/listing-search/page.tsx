"use client";

import { useState, useEffect } from "react";
import CustomerUserSidebar from "@/app/components/customersidebar";

export default function CustomerList() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<{ name: string; email: string; phone: number; join_date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch customers from the backend API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customer"); // Fetch customers from API
        if (!response.ok) {
          throw new Error("Failed to fetch customers");
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError("Error fetching customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone.toString().includes(search)
  );

  return (
    <div className="flex min-h-screen">
      <CustomerUserSidebar />
      <div className="mt-40 flex-1 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-blue-900">🔍 Customer Listing & Search</h1>
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          className="mt-4 p-2 border rounded w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <p className="text-center text-gray-500 p-4">Loading customers...</p>
          ) : error ? (
            <p className="text-center text-red-500 p-4">{error}</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-4">{customer.name}</td>
                      <td className="p-4">{customer.email}</td>
                      <td className="p-4">{customer.phone}</td>
                      <td className="p-4">{customer.join_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}