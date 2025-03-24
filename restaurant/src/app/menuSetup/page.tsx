"use client";
import React, { useState, useEffect } from "react";

interface FoodItem {
  item_id: number;
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  availability: string;
  image_url: string;
  spicy_level: string;
  quantity: number;
}

// 🔹 Category Mapping for Backend
const categoryMapping: Record<string, number> = {
  "Breakfast": 1,
  "Main Course": 2,
  "Desserts": 3,
  "Snacks": 4,
  "Drinks": 5,
};

const AdminPage = () => {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [availability] = useState("Available");
  const [image, setImage] = useState<string | null>(null);
  const [spicyLevel, setSpicyLevel] = useState("");
  const [quantity, setQuantity] = useState<string>("");
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  // 🔹 Fetch All Food Items
  const fetchFoodItems = async () => {
    try {
      const res = await fetch("/api/menuitem");
      if (!res.ok) throw new Error("Failed to fetch menu items");
      const data = await res.json();
      setFoodItems(data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  // 🔹 Handle Image Upload
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

  // 🔹 Submit Food Data (Add/Update)
  const handleFoodSubmit = async () => {
    try {
      const category_id = categoryMapping[category] || 1;
      const method = editingId ? "PUT" : "POST";
      const url = "/api/menuitem"; // ✅ Use same URL for both POST and PUT
  
      console.log("Submitting:", {
        id: editingId, // ✅ Ensure ID is included
        category_id,
        name,
        description,
        price: parseFloat(price),
        availability,
        image_url: image,
        quantity: parseInt(quantity, 10),
        spicy_level: spicyLevel,
      });
  
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId, // ✅ Ensure ID is sent
          category_id,
          name,
          description,
          price: parseFloat(price),
          availability,
          image_url: image,
          quantity: parseInt(quantity, 10),
          spicy_level: spicyLevel,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save menu item");
      }
  
      console.log("Update successful! Refreshing food list...");
      await fetchFoodItems(); // ✅ Refresh the menu list after update
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };
  
  // 🔹 Delete Item
  const deleteFoodItem = async (item_id: number) => {
    if (!item_id) {
      console.error("Invalid item_id:", item_id);
      return;
    }
  
    try {
      console.log("Deleting item with ID:", item_id); // Debugging
  
      const res = await fetch("/api/menuitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item_id }), // Ensure correct id is sent
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete menu item");
      }
  
      // Remove the deleted item from state
      setFoodItems((prev) => prev.filter((item) => item.item_id !== item_id));
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };
  

  // 🔹 Edit Food Item
  const editFoodItem = (item: FoodItem) => {
    console.log("Editing item:", item); // Debugging
  
    setCategory(Object.keys(categoryMapping).find((key) => categoryMapping[key] === item.category_id) || "");
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImage(item.image_url);
    setSpicyLevel(item.spicy_level);
    setQuantity(item.quantity.toString());
    setEditingId(item.item_id); // ✅ Use item_id, not id
  };
  
  

  // 🔹 Reset Form Fields
  const resetForm = () => {
    setCategory("");
    setName("");
    setDescription("");
    setPrice("");
    setImage(null);
    setSpicyLevel("");
    setQuantity("");
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-2 mt-32">Admin Menu Setup</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => (window.location.href = "/adminDashboard")}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* 🔹 Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
          {editingId !== null ? "Update Food" : "Add Food"}
        </h2>

        <select className="w-full mb-3 p-2 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {Object.keys(categoryMapping).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Food Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="number" placeholder="Price ($)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <textarea className="w-full mb-3 p-2 border rounded-lg" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Spicy Level" value={spicyLevel} onChange={(e) => setSpicyLevel(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input type="file" className="w-full p-2 border rounded-lg" onChange={handleImageUpload} />
        {image && <img src={image} alt="Preview" className="w-28 h-28 object-cover rounded-lg shadow-md mt-3" />}

        <button className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-blue-800 hover:bg-blue-900 transition-all duration-300" onClick={handleFoodSubmit}>
          {editingId !== null ? "Update Food" : "Add Food"}
        </button>
      </div>

      {/* 🔹 Food List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {foodItems.map((item, index) => (
  <div key={item.id ? `food-${item.id}` : `food-index-${index}`} className="bg-white shadow-lg rounded-xl overflow-hidden w-72 mx-auto">
    <img src={item.image_url || "/placeholder.jpg"} alt={item.name} className="w-full h-48 object-cover rounded-t-xl" />
    <div className="p-3 text-center">
      <h2 className="text-2xl font-bold">{item.name}</h2>
      <p className="text-sm">{item.description}</p>
      <p className="text-lg font-semibold">${item.price}</p>
      <button onClick={() => editFoodItem(item)} className="bg-yellow-500 text-white px-8 py-2 rounded-lg">Edit</button>
      <button onClick={() => deleteFoodItem(item.item_id)} className="bg-red-500 text-white px-8 py-2 rounded-lg">Delete</button>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

export default AdminPage;