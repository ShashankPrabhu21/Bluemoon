"use client";
import React, { useState, useEffect, useRef } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

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

  const handleFoodSubmit = async () => {
    setIsSubmitting(true);
    try {
      const category_id = categoryMapping[category] || 1;
      const method = editingId ? "PUT" : "POST";
      const url = "/api/menuitem";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
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

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to save menu item");
        return;
      }

      if (method === "POST") {
        alert("Item added successfully");
      } else {
        alert("Item updated successfully");
      }

      await fetchFoodItems();
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteFoodItem = async (item_id: number, itemName: string) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${itemName}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/menuitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete menu item");
      }

      setFoodItems((prev) => prev.filter((item) => item.item_id !== item_id));
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const editFoodItem = (item: FoodItem) => {
    setCategory(Object.keys(categoryMapping).find((key) => categoryMapping[key] === item.category_id) || "");
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setImage(item.image_url);
    setSpicyLevel(item.spicy_level);
    setQuantity(item.quantity.toString());
    setEditingId(item.item_id);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-2 mt-32">Admin Menu Setup</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => (window.location.href = "/adminDashboard")}
          className="bg-blue-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* Form */}
      <div ref={formRef} className="bg-white shadow-lg rounded-xl p-6 max-w-lg mx-auto mb-8 border border-gray-200">
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
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Spicy Level - mild/medium/high" value={spicyLevel} onChange={(e) => setSpicyLevel(e.target.value)} />
        <input className="w-full mb-3 p-2 border rounded-lg" type="text" placeholder="Item Number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <label className="block mb-1 text-sm text-gray-600">
   Upload Image (Max: 350KB)
</label>
<input
  type="file"
  accept="image/*"
  className="w-full p-2 border rounded-lg"
  onChange={handleImageUpload}
/>

        {image && <img src={image} alt="Preview" className="w-28 h-28 object-cover rounded-lg shadow-md mt-3" />}

        <button
          className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-blue-800 hover:bg-blue-900 transition-all duration-300"
          onClick={handleFoodSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingId !== null
              ? "Updating..."
              : "Adding..."
            : editingId !== null
            ? "Update Food"
            : "Add Food"}
        </button>
      </div>

      {/* Food List */}
      <div className="w-full max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {foodItems.map((item) => (
            <div
              key={item.item_id}
              className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-xs mx-auto transform transition duration-300 hover:scale-105"
            >
              <img
                src={item.image_url || "/placeholder.jpg"}
                alt={item.name}
                className="w-full h-52 object-cover rounded-t-2xl"
              />
              <div className="p-4 text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                <p className="text-gray-500 text-sm">{item.description}</p>
                <p className="text-xl font-semibold text-blue-800">${item.price}</p>
                <p className="text-md font-medium text-green-700">
                  Item Number: {item.quantity}
                </p>

                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() => editFoodItem(item)}
                    className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-600 transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteFoodItem(item.item_id, item.name)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-red-600 transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
