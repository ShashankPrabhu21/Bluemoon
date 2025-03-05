"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface FoodItem {
  id: number;
  category: string;
  foodName: string;
  price: string;
  token: string;
  description: string;
  image: string;
}

const AdminPage = () => {
  const [category, setCategory] = useState("");
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [token, setToken] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const storedItems = localStorage.getItem("foodItems");
    if (storedItems) {
      setFoodItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    if (foodItems.length > 0) {
      localStorage.setItem("foodItems", JSON.stringify(foodItems));
    }
  }, [foodItems]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToMenu = () => {
    localStorage.setItem("menuItems", JSON.stringify(foodItems));
    alert("Items successfully added to the menu!");
  };

  const handleFoodSubmit = () => {
    if (!category || !foodName || !price || !token || !description || !image) {
      alert("Please fill all fields");
      return;
    }

    if (editingId !== null) {
      const updatedItems = foodItems.map((item) =>
        item.id === editingId
          ? { ...item, category, foodName, price, token, description, image }
          : item
      );
      setFoodItems(updatedItems);
      setEditingId(null);
    } else {
      const newItem: FoodItem = {
        id: Date.now(),
        category,
        foodName,
        price,
        token,
        description,
        image,
      };
      setFoodItems([...foodItems, newItem]);
    }

    setCategory("");
    setFoodName("");
    setPrice("");
    setToken("");
    setDescription("");
    setImage(null);
  };

  const deleteFoodItem = (id: number) => {
    const updatedItems = foodItems.filter((item) => item.id !== id);
    setFoodItems(updatedItems);
    localStorage.setItem("foodItems", JSON.stringify(updatedItems));
  };

  const editFoodItem = (id: number) => {
    const item = foodItems.find((item) => item.id === id);
    if (item) {
      setCategory(item.category);
      setFoodName(item.foodName);
      setPrice(item.price);
      setToken(item.token);
      setDescription(item.description);
      setImage(item.image);
      setEditingId(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 mt-32">Admin Menu</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {editingId !== null ? "Update Food" : "Add Food"}
        </h2>

        <select
          className="w-full mb-3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Main Course">Main Course</option>
          <option value="Desserts">Desserts</option>
          <option value="Snacks">Snacks</option>
          <option value="Dinner">Drinks</option>
        </select>

        <input
          className="w-full mb-3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />

        <div className="flex gap-3">
          <input
            className="w-1/2 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Token Number"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input
            className="w-1/2 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Price ($)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <textarea
          className="w-full mt-3 p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />

        <div className="mt-3">
          <input type="file" className="w-full p-2 border rounded-lg" onChange={handleImageUpload} />
        </div>

        {image && (
          <div className="flex justify-center mt-3">
            <img src={image} alt="Preview" className="w-28 h-28 object-cover rounded-lg shadow-md" />
          </div>
        )}

        <button
          className="w-full mt-4 py-2 text-white font-semibold rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-transform transform hover:scale-105"
          onClick={handleFoodSubmit}
        >
          {editingId !== null ? "Update Food" : "Add Food"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {foodItems.map((item) => (
          <div key={item.id} className="bg-white shadow-lg rounded-xl overflow-hidden w-72 mx-auto">
            <img src={item.image} alt={item.foodName} className="w-full h-48 object-cover rounded-t-xl" />
            <div className="p-3 text-center text-black">
                <span className="text-xs font-semibold uppercase bg-black bg-opacity-40 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <h2 className="text-2xl font-bold mt-2">{item.foodName}</h2>
                <p className="text-sm mt-1 truncate">{item.description}</p>

                <div className="flex justify-between items-center bg-black bg-opacity-20 p-2 rounded-md mt-2">
                  <span className="text-xl font-semibold">${item.price}</span>
                  <span className="text-xs font-medium">
                    Token: <span className="text-lg font-bold">{item.token}</span>
                  </span>
                </div>
            

              {/* Edit & Delete Buttons */}
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => editFoodItem(item.id)}
                  className="bg-yellow-500 text-white px-8 py-2 rounded-lg text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteFoodItem(item.id)}
                  className="bg-red-500 text-white px-8 py-2 rounded-lg text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button onClick={handleAddToMenu} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
          Add to Menu
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
