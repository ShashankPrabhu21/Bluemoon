"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="mt-32 h-screen flex bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Sidebar with Glassmorphism */}
      <aside className="w-1/4 bg-blue-900 bg-opacity-90 backdrop-blur-lg text-white p-6 flex flex-col gap-6 shadow-2xl rounded-r-3xl border-r-4 border-blue-800">
        <h2 className="text-3xl font-extrabold text-center tracking-wide drop-shadow-lg">
          🛠️ ADMIN DASHBOARD
        </h2>

        <nav className="flex flex-col gap-4">
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/menuSetup")}
          >
            🍽️ SETUP MENU CARD
          </button>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg">
            🔑 CHANGE ADMIN PASSWORD
          </button>

          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
            onClick={() => router.push("/offerSetup")}
          >
            🎁 SETUP OFFERS
          </button>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg">
            👥 USER MANAGEMENT
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <div className="grid grid-cols-2 gap-8">
          {/* Setup Offers */}
          <section 
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"
            onClick={() => router.push("/offerSetup")}
          >
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🎁 SETUP OFFERS</h3>
            <div className="flex flex-col gap-4">
              <button className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🌞 DAILY OFFERS
              </button>
              <button className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🎉 WEEKEND OFFERS
              </button>
              <button className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:scale-105 transition-all duration-300 shadow-md">
                🌿 SEASONAL OFFERS
              </button>
            </div>
          </section>

          {/* Change Admin Password */}
          <section className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900">🔑 CHANGE ADMIN PASSWORD</h3>
          </section>

          {/* Setup Menu */}
          <section 
            className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200 cursor-pointer"
            onClick={() => router.push("/menuSetup")}
          >
            <h3 className="text-2xl font-bold text-blue-900">🍽️ SETUP MENU CARD</h3>
          </section>

          {/* User Management */}
          <section className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all duration-300 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900">👥 USER MANAGEMENT</h3>
          </section>
        </div>
      </main>
    </div>
  );
}
