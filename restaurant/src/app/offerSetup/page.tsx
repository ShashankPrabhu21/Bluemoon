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
  category: string;
  selectedItems: FoodItem[];
  totalPrice: number;
  discountedPrice: number;
  offerType: string;
  startDate?: string;
  endDate?: string;
}

const OfferSection = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<FoodItem[]>([]);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [offerType, setOfferType] = useState("Daily Offer");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedItems = localStorage.getItem("foodItems");
      const storedOffers = localStorage.getItem("offers");
      if (storedItems) setFoodItems(JSON.parse(storedItems));
      if (storedOffers) setOffers(JSON.parse(storedOffers));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && offers.length > 0) {
      localStorage.setItem("offers", JSON.stringify(offers));
    }
  }, [offers]);

  const handleCreateOffer = () => {
    if (selectedItems.length < 2 || !discountedPrice) {
      alert("Select at least 2 items and enter a discounted price");
      return;
    }
    if (offerType === "Seasonal Offer" && (!startDate || !endDate)) {
      alert("Enter a valid date range");
      return;
    }

    const totalPrice = selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    const newOffer: Offer = {
      id: Date.now(),
      category: selectedCategory!,
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
    setSelectedCategory(null);
  };

  // Update selected items on card click
  
  const handleCardClick = (item: FoodItem) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i.id !== item.id) // Remove item if already selected
        : [...prev, item] // Add item if not selected
    );
  };

  const handleDeleteOffer = (id: number) => {
    const updatedOffers = offers.filter((offer) => offer.id !== id);
    setOffers(updatedOffers);
    localStorage.setItem("offers", JSON.stringify(updatedOffers));
    console.log(`Offer with ID ${id} has been deleted.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 mt-32">Admin SetUp Offers</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => window.location.href = "/adminDashboard"}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>
      {!selectedCategory ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...new Set(foodItems.map((item) => item.category))].map((category) => (
            <div key={category} className="p-6 bg-white rounded-lg shadow-lg cursor-pointer" onClick={() => setSelectedCategory(category)}>
              <h2 className="text-xl font-bold text-center">{category}</h2>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button className="mb-4 p-2 bg-gray-300 rounded" onClick={() => setSelectedCategory(null)}>Back to Categories</button>
          <h2 className="text-2xl font-semibold">Create Offer in {selectedCategory}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {foodItems.filter((item) => item.category === selectedCategory).map((item) => (
              <div
                key={item.id}
                className={`h-[100%] p-4 border rounded cursor-pointer ${selectedItems.includes(item) ? "bg-blue-300" : "bg-white"} h-48`}
                onClick={() => handleCardClick(item)} // Handle card click
              >
                <img src={item.image} alt={item.foodName} className="w-full h-64 object-cover rounded" />
                <div className="mt-2 text-center">
                  <h3 className="text-2xl font-semibold text-gray-800">{item.foodName}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="font-medium text-blue-600">Token: {item.token}</p>
                  <p className="font-semibold text-green-600 text-2xl">${item.price}</p>
                </div>

              </div>
            ))}
          </div>


              {/* Create a OFFER */}
          <div className="w-full max-w-md mx-auto mt-6 p-6 border rounded-xl bg-gray-100 shadow-lg"> 
            <h2 className="text-2xl font-semibold text-center mb-4">Total Price: ${selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}</h2>   
            <div className="mb-4">
              <label htmlFor="offerType" className="block text-sm font-medium text-gray-700">Offer Type</label>
              <select 
                id="offerType" 
                className="w-full p-3 mt-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={offerType} 
                onChange={(e) => setOfferType(e.target.value)}
              >
                <option>Daily Offer</option>
                <option>Weekend Offer</option>
                <option>Seasonal Offer</option>
              </select>
            </div>

            {offerType === "Seasonal Offer" && (
              <div className="mb-4">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  className="w-full p-3 mt-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />

                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mt-4">End Date</label>
                <input 
                  type="date" 
                  id="endDate" 
                  className="w-full p-3 mt-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700">Discounted Price</label>
              <input 
                type="number" 
                id="discountedPrice" 
                placeholder="Enter Discounted Price" 
                className="w-full p-3 mt-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={discountedPrice} 
                onChange={(e) => setDiscountedPrice(e.target.value)} 
              />
            </div>
            <button 
              className="w-full py-3 mt-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
              onClick={handleCreateOffer}
            >
              Create Offer
            </button>
          </div>

        </div>
      )}

      {/* Create a OFFER CARD */}    
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Active Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((offer) => (
            <div key={offer.id} className="p-4 bg-white rounded-lg shadow-lg mb-4 w-full max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold text-center bg-yellow-500 text-white py-2 rounded-md">
                {offer.offerType}
              </h3>
              {/* Actual total price with strikethrough and red color */}
              <p className="text-center text-xl text-red-500 line-through">
                Total Price: ${offer.selectedItems.reduce((sum, item) => sum + parseFloat(item.price), 0)}
              </p>
              <p className="text-center text-xl text-green-700">Discounted Price: ${offer.discountedPrice}</p>
              <div className="flex flex-wrap gap-4 justify-center mt-2 p-3">
                {offer.selectedItems.map((item) => (
                  <div key={item.id} className="w-32 h-42">
                    <img src={item.image} alt={item.foodName} className="w-full h-full object-cover rounded-md" />
                    <p className="text-md text-center ">{item.foodName}</p>
                  </div>
                  
                ))}
              </div>
              <div className="flex justify-center mt-3 mx-auto p-3 w-full">
                  <button onClick={() => handleDeleteOffer(offer.id)} className="bg-red-500 text-white px-4 py-1 rounded-lg">
                    Delete
                  </button>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferSection;
