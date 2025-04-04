"use client";

import { useEffect, useState } from "react";

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  image_url: string;
  quantity:number;
}

interface Offer {
  id: number;
  selected_items: string; // Ensure this is stored as a JSON string in the database
  total_price: number;
  discounted_price: number;
  offer_type: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function OfferSetup() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [discountedPrice, setDiscountedPrice] = useState<number | "">("");
  const [offerType, setOfferType] = useState("Daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOffersAndItems = async () => {
      try {
        const res = await fetch("/api/offers");
        const data = await res.json();

        setFoodItems(
          data.foodItems.map((item: FoodItem) => ({
            ...item,
            price: Number(item.price) || 0,
          }))
        );

        setOffers(Array.isArray(data.offers) ? data.offers : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFoodItems([]);
      }
    };

    fetchOffersAndItems();
  }, []);

  const handleItemSelection = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleCancelEdit = () => {
    setSelectedItems([]);
    setDiscountedPrice("");
    setOfferType("Daily");
    setStartDate("");
    setEndDate("");
    setEditingOfferId(null);
  };
  

  const calculateTotalPrice = () => {
    return selectedItems.reduce((sum, id) => {
      const item = foodItems.find((item) => item.item_id === id);
      return sum + (item ? item.price : 0);
    }, 0);
  };

  const handleSubmit = async () => {
    const totalPrice = calculateTotalPrice();

    if (selectedItems.length < 2 || !discountedPrice || totalPrice <= 0) {
      alert("Please select at least 2 food items, enter a valid discounted price, and ensure the total price is valid.");
      return;
    }

    const requestBody = {
      selectedItems,
      totalPrice,
      discountedPrice: Number(discountedPrice),
      offerType,
      startDate,
      endDate,
    };

    console.log("Submitting requestBody:", requestBody);


    try {
      const res = await fetch(
        editingOfferId ? `/api/offers/${editingOfferId}` : "/api/offers",
        {
          method: editingOfferId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        alert(editingOfferId ? "Offer updated successfully!" : "Offer created successfully!");
        setSelectedItems([]);
        setDiscountedPrice("");
        setOfferType("Daily");
        setStartDate("");
        setEndDate("");
        setEditingOfferId(null);

        // Refresh offers list
        const updatedOffers = await fetch("/api/offers").then((res) => res.json());
        setOffers(updatedOffers.offers);
      } else {
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  };

  const handleEdit = (offer: Offer) => {
    setEditingOfferId(offer.id);
    setSelectedItems(
      typeof offer.selected_items === "string"
        ? JSON.parse(offer.selected_items)
        : offer.selected_items
    );
    setDiscountedPrice(offer.discounted_price);
    setOfferType(offer.offer_type);
    setStartDate(offer.start_date.split("T")[0]); // Extract the date part
    setEndDate(offer.end_date.split("T")[0]); // Extract the date part
  };

  const handleDelete = async (offerId: number) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
  
    try {
      const res = await fetch(`/api/offers/${offerId}`, { method: "DELETE" });
  
      if (res.ok) {
        alert("Offer deleted successfully!");
  
        // Refresh offers list
        const updatedOffers = await fetch("/api/offers").then((res) => res.json());
        setOffers(updatedOffers.offers);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("An error occurred while trying to delete the offer.");
    }
  };
  

  
  
  

  return (
    <div className="container mx-auto p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Offer Setup</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => (window.location.href = "/adminDashboard")}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {foodItems.length > 0 ? (
    foodItems.map((item) => (
      <div
      key={item.item_id}
      className={`border p-4 rounded-xl shadow-md transition duration-300 transform hover:scale-105 cursor-pointer ${
        selectedItems.includes(item.item_id) ? "bg-blue-100 border-blue-500" : "bg-white"
      }`}
        onClick={() => handleItemSelection(item.item_id)}
      >
        {/* 🔹 Food Image */}
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-44 object-cover rounded-lg shadow-md mb-3"
        />

        {/* 🔹 Item Name */}
        <h2 className="text-xl font-extrabold tracking-wide ">
          {item.name}
        </h2>

        {/* 🔹 Item Number (Looks distinct now) */}
        <span className="absolute top-2 right-2 bg-gray-800 text-white text-md px-3 py-1 rounded-full shadow-md">
          🏷️ Item No: {item.quantity}
        </span>

        {/* 🔹 Price */}
        <p className="text-lg font-bold mt-2 text-red-700">
          💰 <span className="drop-shadow-lg">${item.price.toFixed(2)}</span>
        </p>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 text-sm col-span-4">Loading food items...</p>
  )}
</div>

{/* 🔹 Form for offers */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold bg-yellow-400 text-center py-2 rounded-md w-full">
            {editingOfferId ? "Edit Offer" : "Create the Offer"}
          </h2>
        </div>

        <div className="w-full max-w-md mt-4">
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekend">Weekend</option>
            <option value="Seasonal">Seasonal</option>
          </select>

          <p className="font-semibold text-center">
            Total Price: ${calculateTotalPrice().toFixed(2)}
          </p>

          <input
            type="number"
            placeholder="Discounted Price"
            value={discountedPrice}
            onChange={(e) =>
              setDiscountedPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 w-full mb-2"
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            {editingOfferId ? "Update Offer" : "Submit Offer"}
          </button>
          {editingOfferId && (
          <button
            onClick={handleCancelEdit}
            className="bg-gray-500 text-white p-2 rounded w-full mt-2"
          >
            Cancel Edit
          </button>
        )}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-3 rounded-lg shadow-md mt-8">
        🎉 Available Offers
          </h2>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div
                key={offer.id}
                className="p-5 border border-gray-300 rounded-xl bg-white shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]"
              >
                {/* 🔹 Offer Type Badge */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center font-semibold py-1.5 rounded-t-xl text-sm tracking-wide shadow-md">
                  ⭐ {offer.offer_type} Offer
                </div>

                {/* 🔹 Price Section */}
                <div className="text-center my-3">
                  <p className="text-red-500 line-through text-sm font-medium">
                    💲 Total Price: <span className="font-semibold">${Number(offer.total_price).toFixed(2)}</span>
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    ✅ Discounted Price: <span className="text-xl">${Number(offer.discounted_price).toFixed(2)}</span>
                  </p>
                </div>

                {/* 🔹 Selected Items Grid */}
                <div className="flex flex-wrap justify-center gap-3">
                  {(typeof offer.selected_items === "string"
                    ? JSON.parse(offer.selected_items)
                    : offer.selected_items
                  ).map((itemId: number) => {
                    const item = foodItems.find((food) => food.item_id === itemId);
                    return item ? (
                      <div key={item.item_id} className="text-center w-20">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-md"
                        />
                        <p className="text-xs font-medium mt-1">{item.name}</p>
                        <p className="text-[10px] font-semibold text-gray-700 bg-gray-200 px-2 py-1 rounded-md mt-1">
                          Item No. {item.quantity}
                        </p>
                      </div>
                    ) : null;
                  })}
                </div>

                {/* 🔹 Edit & Delete Buttons */}
                <div className="flex justify-between mt-5">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
                    onClick={() => handleEdit(offer)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
                    onClick={() => handleDelete(offer.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 text-sm">No offers available.</p>
          )}
        </div>


            </div>
          );
        }
