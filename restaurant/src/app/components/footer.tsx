// components/Footer.tsx (or Footer.jsx)
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#3345A7] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <p className="text-sm">© {new Date().getFullYear()} Bluemoon Restaurant. All rights reserved.</p>
        </div>

        {/* Right Section */}
        <div className="flex gap-6 items-center justify-center">
          <Link href="#">
            <span className="cursor-pointer hover:text-gray-200">
              <Mail size={20} />
            </span>
          </Link>
          <Link href="#">
            <span className="cursor-pointer hover:text-gray-200">
              <Phone size={20} />
            </span>
          </Link>
          <Link href="#">
            <span className="cursor-pointer hover:text-gray-200">
              <Facebook size={20} />
            </span>
          </Link>
          <Link href="#">
            <span className="cursor-pointer hover:text-gray-200">
              <Instagram size={20} />
            </span>
          </Link>
          <Link href="#">
            <span className="cursor-pointer hover:text-gray-200">
              <Twitter size={20} />
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
