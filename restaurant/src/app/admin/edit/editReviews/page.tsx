// app/admin-reviews/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { FiTrash2 } from "react-icons/fi"; // For the delete icon
import EditUserSidebar from "@/app/components/editSidebar";

interface Review {
  id: number;
  name: string;
  gender?: string;
  rating: number;
  experience: string;
  created_at: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reviews");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch reviews");
        console.error("Failed to fetch reviews:", errorData);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching reviews.");
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
        alert("Review deleted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to delete review: ${errorData.error || "Unknown error"}`);
        console.error("Failed to delete review:", errorData);
      }
    } catch (err) {
      alert("An unexpected error occurred during deletion.");
      console.error("Error deleting review:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-lg text-gray-700">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50 text-red-700 font-bold text-xl p-4 rounded-md shadow-md">
        Error: {error}
      </div>
    );
  }

  return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-800 to-black text-white mt-24">
          <EditUserSidebar />
         <div className="flex-grow ">
       
      {reviews.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 mt-24">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Gender</th>
                <th className="py-3 px-6 text-center">Rating</th>
                <th className="py-3 px-6 text-left">Experience</th>
                <th className="py-3 px-6 text-left">Created At</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm font-light">
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{review.id}</td>
                  <td className="py-3 px-6 text-left">{review.name}</td>
                  <td className="py-3 px-6 text-left">{review.gender || "N/A"}</td>
                  <td className="py-3 px-6 text-center">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <span key={index} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </td>
                  <td className="py-3 px-6 text-left max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {review.experience}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {format(new Date(review.created_at), "PPP")}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Delete Review"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
      )}
       </div>
    </div>
  );
}