"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from "lucide-react"

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
    const [image, setImage] = useState<string | null>(null);  // Store base64 string
    const [spicyLevel, setSpicyLevel] = useState("");
    const [quantity, setQuantity] = useState<string>("");
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const formRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchFoodItems = useCallback(async (currentPage: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/menuitem?page=${currentPage}&limit=10`);
            if (!res.ok) {
                throw new Error("Failed to fetch menu items");
            }
            const data: FoodItem[] = await res.json();
            if (data.length === 0) {
                setHasMore(false);
            }
            setFoodItems(prevItems => [...prevItems, ...data]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Failed to fetch menu items');
            } else {
                setError('Failed to fetch menu items');
            }
        }
         finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFoodItems(page);
    }, [fetchFoodItems, page]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                setImage(base64String); // Store base64
                setIsUploading(false);
            };
            reader.onerror = () => {
                setError("Failed to read file");
                setIsUploading(false);
            }
            reader.readAsDataURL(file); //convert to base64
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
                    image_url: image, // Send base64 string
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

            resetForm();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || "An error occurred");
                console.error("Error saving menu item:", error);
            } else {
                setError("An unknown error occurred");
                console.error("Unknown error saving menu item:", error);
            }
        }
        finally {
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
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                console.error("Error deleting food item:", error);
            } else {
                setError("An unknown error occurred");
                console.error("Unknown error deleting food item:", error);
            }
        }
        
    };

    const editFoodItem = (item: FoodItem) => {
        setCategory(Object.keys(categoryMapping).find((key) => categoryMapping[key] === item.category_id) || "");
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price.toString());
        setImage(item.image_url);  // This should already be a base64 string, if you followed the previous version.
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

    const lastFoodItemRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-3xl font-bold text-center mb-2 mt-32">Admin Menu Setup</h1>

            <div className="flex justify-center mb-6">
                <button
                    onClick={() => (window.location.href = "/adminDashboard")}
                    className="my-custom-button"
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
                <input type="file" className="w-full p-2 border rounded-lg" onChange={handleImageUpload} disabled={isUploading} />
                {isUploading && <p className="text-gray-500 text-sm mt-1">Uploading image...</p>}
                {image && <img src={image} alt="Preview" className="w-28 h-28 object-cover rounded-lg shadow-md mt-3" />}

                <button
                    className="w-full mt-4 py-2 text-white font-semibold rounded-lg bg-blue-800 hover:bg-blue-900 transition-all duration-300"
                    onClick={handleFoodSubmit}
                    disabled={isSubmitting || isUploading}
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
                {error && (
                    <div className="my-custom-alert">
                        <AlertCircle className="h-4 w-4" />
                        <h2 className="my-custom-alert-title">Error</h2>
                        <p className="my-custom-alert-description">{error}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {foodItems.map((item, index) => {
                            const isLastItem = index === foodItems.length - 1;
                            return (
                                <motion.div
                                    key={index}
                                    ref={isLastItem ? lastFoodItemRef : null}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-xs mx-auto transform transition duration-300 hover:scale-105"
                                >
                                    {loading && isLastItem ? (
                                        <div className="my-skeleton w-full h-52 object-cover rounded-t-2xl"></div>
                                    ) : (
                                        <img
                                            src={item.image_url || "/placeholder.jpg"}
                                            alt={item.name}
                                            className="w-full h-52 object-cover rounded-t-2xl"
                                        />
                                    )}

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
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="my-skeleton w-20 h-8 rounded-full"></div>
                    </div>
                )}
                {!hasMore && (
                    <div className="text-center text-gray-500 py-4">
                        That's all folks!
                    </div>
                )}
            </div>
            <style jsx global>{`
                .my-custom-button {
                    background-color: #3b82f6;
                    color: #fff;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.2);
                    font-weight: 600;
                    transition: background-color 0.3s ease;
                    cursor: pointer;
                }

                .my-custom-button:hover {
                    background-color: #2563eb;
                }

                .my-skeleton {
                    background-color: #e5e7eb;
                    -webkit-animation: shimmer 1.5s infinite linear;
                    animation: shimmer 1.5s infinite linear;
                    border-radius: 0.375rem;
                }

                .my-custom-alert {
                    background-color: #fef0f0;
                    border-left-width: 4px;
                    border-color: #fecaca;
                    padding: 1rem;
                    border-radius: 0.375rem;
                    margin-bottom: 1rem;
                    color: #b91c1c;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .my-custom-alert-title {
                    font-weight: 600;
                    font-size: 1.25rem;
                    line-height: 1.75rem
                }

                .my-custom-alert-description {
                    font-size: 1rem;
                    line-height: 1.5rem;
                }

                @-webkit-keyframes shimmer {
                    0% {
                        background-position: -468px 0;
                    }

                    100% {
                        background-position: 468px 0;
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -468px 0;
                    }

                    100% {
                        background-position: 468px 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminPage;
