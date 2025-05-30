"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import OrderModal from "../components/OrderModal";

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  spicy_level: string;
  quantity: number;
}

interface CartItem {
  cart_id: number;
  food_name: string;
  price: number;
  image: string;
  quantity: number;
  special_note: string;
  item_id: number;
  user_id: number;
  service_type: string;
}

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const ITEMS_PER_PAGE = 12; // Define how many items to load per request, same as MenuPage

const OnlineOrderPage = () => {
  const [items, setItems] = useState<FoodItem[]>([]); // Renamed from foodItems to items for consistency
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [serviceType, setServiceType] = useState<string>("delivery");
  const [loading, setLoading] = useState(false); // Initialize as false, fetch will set it to true
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Current page for pagination (0-indexed)
  const [hasMore, setHasMore] = useState(true); // True if there's more data to load
  const [filteredCategory, setFilteredCategory] = useState<string | null>(
    null // Default to null for "All Menu" initially
  ); // New state to hold the currently filtered category

  // --- Intersection Observer for Infinite Scrolling ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // --- Data Fetching Logic for Menu Items ---
  const fetchMenuItems = useCallback(
    async (category: string | null, currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", currentPage.toString());
        queryParams.append("limit", ITEMS_PER_PAGE.toString());

        if (category && category !== "All Menu") {
          queryParams.append("category", category);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(`/api/menuitem?${queryParams.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(
            `HTTP error! status: ${res.status}, Message: ${errorText}`
          );
        }

        const data: FoodItem[] = await res.json();
        console.log(
          `Fetched page ${currentPage} for category "${
            category || "All Menu"
          }":`,
          data
        );

        if (currentPage === 0) {
          setItems(data);
        } else {
          setItems((prevItems) => [...prevItems, ...data]);
        }

        setHasMore(data.length === ITEMS_PER_PAGE);
      } catch (err: unknown) {
        console.error("Failed to fetch menu items:", err);
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("Request timed out. Please try again.");
          } else {
            setError(err.message || "Failed to load menu items.");
          }
        } else {
          setError("An unknown error occurred.");
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // --- Data Fetching Logic for Cart Items ---
  const fetchCartItems = async () => {
    try {
      const res = await fetch("/api/cart/get");
      if (res.ok) {
        const cartData = await res.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      await fetch("/api/cart/clear", {
        method: "POST",
      });
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Initial load effect for menu items and cart logic
  useEffect(() => {
    const handleInitialLoad = async () => {
      // Set an initial category to trigger the first fetch
      setFilteredCategory("All Menu"); // This will trigger the useEffect below to fetch initial data

      if (sessionStorage.getItem("fromCart") === "true") {
        await fetchCartItems();
        sessionStorage.removeItem("fromCart");
      } else {
        await clearCart();
      }
      await fetchCartItems(); // Ensure cart is fetched after initial load/clear
    };

    handleInitialLoad();
  }, []);

  // Effect to trigger menu item fetch when filteredCategory changes or page changes
  useEffect(() => {
    if (filteredCategory !== null) {
      if (page === 0) {
        setItems([]); // Clear existing items when category changes (or initial load)
        setHasMore(true); // Assume there's more data for the new category
        fetchMenuItems(filteredCategory, 0); // Fetch the first page for the new category
      } else {
        fetchMenuItems(filteredCategory, page);
      }
    }
  }, [filteredCategory, page, fetchMenuItems]);

  const addToCart = async (
    item: FoodItem,
    quantity: number,
    specialNote: string
  ) => {
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: item.item_id,
          quantity: quantity,
          special_note: specialNote,
          service_type: serviceType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add to cart: ${response.status} - ${response.statusText} - ${JSON.stringify(
            errorData
          )}`
        );
      }
      await fetchCartItems(); // Re-fetch cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart. Please try again."); // Set a user-friendly error
    }
  };

  const handleCategoryFilter = useCallback((category: string | null) => {
    setFilteredCategory(category);
    setPage(0); // Reset page when filtering by category
    setItems([]); // Clear current items to show skeleton loader for new category
    setHasMore(true); // Assume there's more data for the new category
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Menu
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Define categories for display, including "All Menu"
  const displayCategories = [
    { label: "All Menu", value: null }, // Representing "All Menu" by null to fetch all
    ...Object.values(categoryMapping).map((label) => ({ label, value: label })),
  ];

  // Group items by category for rendering with separate headings
  const groupedItems = items.reduce((acc, item) => {
    const categoryName = categoryMapping[item.category_id];
    if (categoryName) {
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
    }
    return acc;
  }, {} as Record<string, FoodItem[]>);

  // Determine which categories to render based on filter
  const categoriesToRender =
    filteredCategory && filteredCategory !== "All Menu"
      ? [filteredCategory]
      : Object.values(categoryMapping);

  return (
    <div className="min-h-screen py-6 bg-[url('/sec1.jpg')] bg-cover bg-center bg-no-repeat relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black opacity-90"></div>
      <div className="z-10 relative mb-10 px-4 sm:px-8 mt-32">
        {/* Cart Button */}
        <div className="flex justify-center lg:justify-end lg:absolute lg:top-0 lg:right-2 w-full z-50">
          <Link
            href="/cart"
            className="mb-4 lg:mb-0 flex items-center space-x-2 bg-blue-600 text-white px-4 sm:px-5 py-3 sm:py-3 rounded-lg shadow-md hover:bg-blue-500 transition"
          >
            <FiShoppingCart size={22} className="sm:size-[26px]" />
            <span className="text-base sm:text-lg font-semibold">
              Cart ({cart.length})
            </span>
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-white tracking-wide bg-gradient-to-r from-black to-gray-700 text-transparent bg-clip-text drop-shadow-lg text-center">
          Online Order
        </h1>
      </div>

      {/* Service Type Selection */}
      <div className="z-10 flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-6 text-center">
        <span className="text-lg sm:text-xl font-semibold z-10 text-white">
          Select Service Type:
        </span>

        <div className="flex bg-gray-200 p-1 rounded-full shadow-lg border border-gray-300 z-10">
          <button
            onClick={() => setServiceType("pickup")}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out
              ${
                serviceType === "pickup"
                  ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white shadow-xl transform scale-105"
                  : "bg-transparent text-gray-700 hover:text-blue-500"
              }`}
          >
            Pickup
          </button>

          <button
            onClick={() => setServiceType("delivery")}
            className={`px-6 sm:px-8 py-2 sm:py-2.5 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 ease-in-out
              ${
                serviceType === "delivery"
                  ? "bg-gradient-to-r from-blue-700 to-blue-400 text-white shadow-xl transform scale-105"
                  : "bg-transparent text-gray-700 hover:text-blue-500"
              }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="z-10 flex flex-wrap justify-center gap-4 mb-8 px-4">
        {displayCategories.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategoryFilter(cat.value)}
            className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out
              ${
                filteredCategory === cat.value
                  ? "bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/40"
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Display Items by Category */}
      <div className="mt-12 px-2 sm:px-4">
        {categoriesToRender.map((category) => {
          const categoryItems = groupedItems[category] || [];
          if (categoryItems.length === 0 && !loading) {
            // Don't show category heading if no items and not loading for this category
            return null;
          }
          return (
            <div key={category} className="mb-10">
              <h2 className="mb-6 text-3xl font-bold text-center text-white py-3 relative uppercase tracking-wide">
                {category}
                <span className="absolute left-1/2 bottom-0 w-16 h-1 bg-gradient-to-r from-[#3345A7] to-blue-400 transform -translate-x-1/2"></span>
              </h2>
              {categoryItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4">
                  {categoryItems.map((item, index) => {
                    // Attach ref only to the last item in the *entire* `items` array for IntersectionObserver
                    const isLastItemInOverallList =
                      items.length === items.indexOf(item) + 1;
                    return (
                      <div
                        ref={isLastItemInOverallList ? lastItemElementRef : null}
                        key={`item-${item.item_id}`}
                        className="z-10 group bg-white/90 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-[1.03] transition-all duration-300 ease-in-out rounded-2xl overflow-hidden hover:bg-[#b7cbf9] text-sm sm:text-base"
                      >
                        <Card item={item} setSelectedItem={setSelectedItem} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                !loading && (
                  <p className="text-center text-white text-lg mt-8">
                    No items found in this category.
                  </p>
                )
              )}
            </div>
          );
        })}

        {/* Loading indicator and messages */}
        {loading && <SkeletonGrid />}
        {!loading && items.length === 0 && filteredCategory && filteredCategory !== "All Menu" && (
          <p className="text-white text-center mt-8 text-lg">
            No items found for the selected category.
          </p>
        )}
        {!loading && items.length === 0 && (filteredCategory === null || filteredCategory === "All Menu") && (
          <p className="text-white text-center mt-8 text-lg">
            No menu items available at this time.
          </p>
        )}
        {!hasMore && !loading && items.length > 0 && (
          <p className="text-white text-center mt-8 text-lg">
            You&apos;ve reached the end of the menu!
          </p>
        )}
      </div>

      {selectedItem && (
        <OrderModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={addToCart}
          serviceType={serviceType}
        />
      )}
    </div>
  );
};

// Memoized card component for better performance, modified to handle order button click
const Card = React.memo(
  ({
    item,
    setSelectedItem,
  }: {
    item: FoodItem;
    setSelectedItem: (item: FoodItem) => void;
  }) => (
    <>
      <div className="relative w-full h-32 sm:h-48">
        <Image
          src={item.image_url || "/placeholder.jpg"}
          alt={item.name}
          fill
          className="object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          loading="lazy"
        />
      </div>
      <div className="p-2 sm:p-3 text-center rounded-b-xl">
        <h3 className="text-sm sm:text-lg font-bold text-blue-900 tracking-wide truncate">
          {item.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 p-2 rounded-md mb-2 sm:mb-4">
          <span className="text-blue-800 font-semibold">${item.price}</span>
          <span className="text-gray-500">Item No: {item.quantity}</span>
        </div>

        <button
          onClick={() => setSelectedItem(item)}
          className="w-full py-2 sm:py-2.5 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Order Now
        </button>
      </div>
    </>
  )
);

Card.displayName = "Card";

// Optimized skeleton grid to match ITEMS_PER_PAGE
const SkeletonGrid = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 px-2 sm:px-4 mt-8">
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-white/20 rounded-xl h-64 w-full"
      />
    ))}
  </div>
);

export default OnlineOrderPage;