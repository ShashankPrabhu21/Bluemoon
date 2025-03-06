"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number;
  category: string;
  foodName: string;
  price: string;
  token: string;
  description: string;
  image: string;
}

interface Offer {
  id: number;
  selectedItems: FoodItem[];
  totalPrice: number;
  discountedPrice: number;
  offerType: string;
  startDate?: string;
  endDate?: string;
}

const AdminPage = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [offerType, setOfferType] = useState("Daily Offer");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItems = localStorage.getItem("foodItems");
      if (storedItems) {
        setFoodItems(JSON.parse(storedItems));
      }
      const storedOffers = localStorage.getItem("offers");
      if (storedOffers) {
        setOffers(JSON.parse(storedOffers));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && offers.length > 0) {
      localStorage.setItem("offers", JSON.stringify(offers));
    }
  }, [offers]);

  const toggleSelectItem = (item: FoodItem) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    );
  };

  const handleCreateOffer = () => {
    if (selectedItems.length < 2) {
      alert("Select at least 2 food items for an offer");
      return;
    }
    if (!discountedPrice) {
      alert("Enter a discounted price");
      return;
    }
    if (offerType === "Seasonal Offer" && (!startDate || !endDate)) {
      alert("Enter a valid date range for the seasonal offer");
      return;
    }

    const totalPrice = selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const newOffer: Offer = {
      id: Date.now(),
      selectedItems,
      totalPrice,
      discountedPrice: parseFloat(discountedPrice),
      offerType,
      startDate: offerType === "Seasonal Offer" ? startDate : undefined,
      endDate: offerType === "Seasonal Offer" ? endDate : undefined,
    };

    setOffers([...offers, newOffer]);
    setSelectedItems([]);
    setDiscountedPrice("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 mt-32">Admin Menu</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold">Select Food Items for Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className={`cursor-pointer border p-3 rounded-lg ${selectedItems.includes(item) ? "bg-blue-300" : "bg-white"}`}
              onClick={() => toggleSelectItem(item)}
            >
              <img src={item.image} alt={item.foodName} className="w-full h-64 object-cover rounded-md" />
              <h3 className="text-lg font-semibold mt-2">{item.foodName}</h3>
              <p className="text-gray-700">Category: {item.category}</p>
              <p className="text-gray-700">Token: {item.token}</p>
              <p className="text-gray-700">Price: ${item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-6 border rounded-lg w-1/3 mx-auto bg-gray-200">
          <h3 className="text-2xl font-semibold">Total Price: ${selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}</h3>
          <select className="w-3/4 mx-auto mt-2 p-2 border rounded-lg block" value={offerType} onChange={(e) => setOfferType(e.target.value)}>
            <option>Daily Offer</option>
            <option>Weekend Offer</option>
            <option>Seasonal Offer</option>
          </select>
          {offerType === "Seasonal Offer" && (
            <div className="mt-2">
              <input type="date" className="w-3/4 p-2 border rounded-lg block" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" className="w-3/4 mt-2 p-2 border rounded-lg block" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          )}
          <input type="number" placeholder="Enter Discounted Price" className="w-3/4 mt-2 p-4 border rounded-lg block mx-auto" value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} />
          <button className="w-3/4 mt-2 p-4 border rounded-lg block bg-green-600 text-white mx-auto" onClick={handleCreateOffer}>Create Offer</button>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Active Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-center bg-yellow-500 text-white py-2 rounded-md">{offer.offerType}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {offer.selectedItems.map((item) => (
                  <div key={item.id} className="w-32 h-32">
                    <img src={item.image} alt={item.foodName} className="w-full h-full object-cover rounded-md" />
                    <p className="text-xs text-center mt-1">{item.foodName}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6">Original Price: <span className="line-through">${offer.totalPrice}</span></p>
              <p className="text-green-600 font-bold">Discounted Price: ${offer.discountedPrice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;