// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#314ec4] text-white py-6 relative z-[50] w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 text-center md:text-left">

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Menu", href: "/menu" },
                { name: "Events", href: "/events" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <li key={index} className="text-center md:text-left">
                  <Link href={link.href} className="relative inline-block pb-1 text-white hover:text-gray-200 transition-colors">
                    {link.name}
                  </Link>
                  <div className="w-28 h-[3px] bg-blue-700 mt-1 mx-auto md:mx-0 shadow-[0_2px_4px_#CFCFCF]"></div> 
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Info</h2>
            <p>Bluemoon Restaurant</p>
            <p>4 Station Street, Wentworthville</p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Phone size={16} />
              <a href="tel:0422306777" className="hover:text-gray-200">0422 306 777</a>
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Mail size={16} />
              <a href="mailto:bluemoonrest@gmail.com" className="hover:text-gray-200">bluemoonrest@gmail.com</a>
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center md:justify-start gap-4">
              <Link href="https://facebook.com" target="_blank"><Facebook size={24} className="cursor-pointer hover:text-gray-200" /></Link>
              <Link href="https://instagram.com" target="_blank"><Instagram size={24} className="cursor-pointer hover:text-gray-200" /></Link>
              <Link href="https://twitter.com" target="_blank"><Twitter size={24} className="cursor-pointer hover:text-gray-200" /></Link>
            </div>
          </div>

          {/* Buttons Centered */}
          <div className="flex flex-col items-center space-y-4">
            <Link href="/order" className="inline-block bg-white text-[#1e3799] text-center py-2 px-12 rounded font-semibold hover:bg-gray-100 transition-colors">
              ORDER ONLINE 
            </Link>
            <Link href="/reserve" className="inline-block border-2 border-white text-center py-2 px-10 rounded font-semibold hover:bg-white hover:text-[#1e3799] transition-colors">
              RESERVE A TABLE
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="text-center mt-8">
        <p>© {new Date().getFullYear()} Bluemoon Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
}
