// components/Footer.tsx
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#314ec4] text-white py-6 relative z-[50]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Quick Links Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Links</h2>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-gray-200">About Us</Link></li>
            <li><Link href="/menu" className="hover:text-gray-200">Menu</Link></li>
            <li><Link href="/events" className="hover:text-gray-200">Events</Link></li>
            <li><Link href="/gallery" className="hover:text-gray-200">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-gray-200">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Info</h2>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span>Bluemoon Restaurant</span>
            </p>
            <p>4 station street Wentworthville</p>
            <p className="flex items-center gap-2">
              <Phone size={16} />
              <a href="tel:0294777158" className="hover:text-gray-200">0422  306  777</a>
            </p>
  
            <p className="flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:mehmaanhornsby@gmail.com" className="hover:text-gray-200">bluemoonrest@gmail.com</a>
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <span className="cursor-pointer hover:text-gray-200">
                <Facebook size={24} />
              </span>
            </Link>
            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span className="cursor-pointer hover:text-gray-200">
                <Instagram size={24} />
              </span>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <span className="cursor-pointer hover:text-gray-200">
                <Twitter size={24} />
              </span>
            </Link>
          </div>
        </div>

        {/* Buttons Moved to Right (4th Column) */}
        <div className="flex flex-col items-end space-y-4">
          <Link href="/order" className="inline-block bg-white text-[#1e3799] text-center py-2 px-3 rounded font-semibold hover:bg-gray-100 transition-colors">
            ORDER ONLINE (10% OFF)
          </Link>
          <Link href="/reserve" className="inline-block border-2 border-white text-center py-2 px-10 rounded font-semibold hover:bg-white hover:text-[#1e3799] transition-colors">
            RESERVE A TABLE
          </Link>
        </div>
      </div>

      
     {/* Bottom Section - Copyright */}
      <div className="footer-bottom text-center mt-8">
        <p>© {new Date().getFullYear()} Bluemoon Restaurant. All rights reserved.</p>
      </div>
      </footer>


  );
}
