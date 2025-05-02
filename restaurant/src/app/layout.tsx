import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import ClientLayout from "./components/clientLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Metadata MUST be exported here (in the server component)
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/LOGO.jpg" type="image/jpg" />
        <title>Bluemoon Restaurant</title>
      </head>
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <Navbar />
        <ClientLayout>{children}</ClientLayout> {/* Wrap children with the client component */}
        <Footer />
      </body>
    </html>
  );
}