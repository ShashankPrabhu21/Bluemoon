"use client";

import { useState, useEffect } from "react";
import AdminUserSidebar from "@/app/components/AdminUserSidebar";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<{ name: string; email: string }[]>([]);

  // Fetch users from localStorage on component mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <AdminUserSidebar />
      <div className="mt-16 md:mt-20 flex-1 flex flex-col items-center p-4">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mt-12">
          🔍 User Listing & Search
        </h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          className="mt-4 p-2 border rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-6 w-full md:w-3/4 bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-3 md:p-4">User Name</th>
                <th className="p-3 md:p-4">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3 md:p-4">{user.name}</td>
                    <td className="p-3 md:p-4">{user.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="p-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}