import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-lg text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
      <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Go to Homepage
      </Link>
    </div>
  );
}
