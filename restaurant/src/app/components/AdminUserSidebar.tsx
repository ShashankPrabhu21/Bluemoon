"use client";
import { useRouter } from "next/navigation";

export default function AdminUserSidebar() {
  const router = useRouter();

  return (
    <aside className="w-1/4 bg-blue-900 bg-opacity-90 backdrop-blur-lg text-white p-6 flex flex-col gap-6 shadow-2xl rounded-r-3xl border-r-4 border-blue-800 h-screen left-0 top-0 mt-32 z-10">
      <h2 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-lg">
        🛠️ ADMIN DASHBOARD
      </h2>

      <nav className="flex flex-col gap-4">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => router.push("/adminDashboard")}>
        ⬅️ Back to Dashboard
        </button>

        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => router.push("/admin/user-management/roles-permissions")}>
         🔐 User Roles & Permissions
        </button>

        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => router.push("/admin/user-management/registration-login")}>
        🏷️ User Registration & Login
        </button>

        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => router.push("/admin/user-management/listing-search")}>
        🔍 User Listing & Search
        </button>

        <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg" onClick={() => router.push("/admin/user-management/user-editing")}>
        ✏️ User Creation & Editing
        </button>
      </nav>
    </aside>
  );
}
