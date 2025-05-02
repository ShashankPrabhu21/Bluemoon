'use client'; // 👈 Add this at the very top to enable client-side behavior

import { useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "./components/footer";
import Navbar from "./components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Metadata can stay exported separately
export const metadata = {
  title: "Bluemoon Restaurant",
  description: "Fine dining at its best.",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "Bluemoon",
    "Kerala Restaurant Australia",
    "Restaurant in Australia",
    "Bluemoon Restaurant",
    "Indian restaurant Australia",
    "authentic Indian food",
    "best Indian cuisine",
    "restaurant booking",
  ],
  openGraph: {
    title: "Bluemoon Restaurant",
    description: "Authentic Indian Cuisine in Australia – Dine in or order online.",
    url: "https://bluemoonrestaurants.com",
    siteName: "Bluemoon Restaurant",
    locale: "en_US",
    type: "website",
  },
  authors: [{ name: "Bluemoon Restaurant" }],
  creator: "Bluemoon Restaurant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🛠️ ChunkLoadError auto reload
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event?.message?.includes('ChunkLoadError')) {
        window.location.reload();
      }
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/LOGO.jpg" type="image/jpg" />
        <title>Bluemoon Restaurant</title>
      </head>
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
