"use client";

import { useEffect, useState } from "react";

interface FoodItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  availability: boolean;
  image_url: string;
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

      <div className="grid grid-cols-3 gap-4">
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <div
              key={item.item_id}
              className={`border p-4 rounded cursor-pointer ${
                selectedItems.includes(item.item_id) ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => handleItemSelection(item.item_id)}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-32 object-cover mb-2"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>Loading food items...</p>
        )}
      </div>

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

      <h2 className="text-xl font-bold bg-yellow-400 text-center py-2 mt-8">
        Available Offers
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div
              key={offer.id}
              className="p-2 border rounded-lg bg-gray-100 shadow-md text-sm"
            >
              <div className="bg-yellow-500 text-white text-center font-bold py-1 rounded-t-lg text-xs">
                {offer.offer_type} Offer
              </div>

              <div className="text-center my-2">
                <p className="text-red-500 line-through text-sm">
                  Total Price: ${Number(offer.total_price).toFixed(2)}
                </p>
                <p className="text-green-600 font-semibold">
                  Discounted Price: ${Number(offer.discounted_price).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-center gap-2">
                {(typeof offer.selected_items === "string"
                  ? JSON.parse(offer.selected_items)
                  : offer.selected_items
                ).map((itemId: number) => {
                  const item = foodItems.find(
                    (food) => food.item_id === itemId
                  );
                  return item ? (
                    <div key={item.item_id} className="text-center">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md shadow-sm"
                      />
                      <p className="text-xs">{item.name}</p>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="flex justify-between mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  onClick={() => handleEdit(offer)}
                >
                  Edit
                </button>
                <button
  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
  onClick={() => handleDelete(offer.id)}
>
  Delete
</button>

              </div>
            </div>
          ))
        ) : (
          <p className="text-sm">No offers available.</p>
        )}
      </div>
    </div>
  );
}
