'use client'; // 👈 Add this at the very top to enable client-side behavior

import { useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "./components/footer";
import Navbar from "./components/navbar";

// Add the Inter font configuration
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Export metadata separately (this can be used in your Head component)
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <title>{metadata.title}</title>
        {/* Use the Head component from Next.js to set metadata */}
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(', ')} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:locale" content={metadata.openGraph.locale} />
        <meta property="og:type" content={metadata.openGraph.type} />
      </head>
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
