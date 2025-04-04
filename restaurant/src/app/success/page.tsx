import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <FaCheckCircle className="text-green-500 text-7xl mb-5 mx-auto drop-shadow-lg" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-md text-gray-600 mb-6">
          Thank you for your purchase. Your order has been confirmed and is being processed.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white font-medium px-6 py-3 rounded-full shadow-md"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
