//app/menu/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface FoodItem {
  item_id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}

const categoryImages: Record<string, string> = {
  "All Menu": "/base.jpg",
  Breakfast: "/breakfast.png",
  "Main Course": "/1.jpg",
  Drinks: "/tea.png",
  Entree: "/snacks.jpg",
};

const categoryMapping: Record<number, string> = {
  1: "Breakfast",
  2: "Main Course",
  4: "Entree",
  5: "Drinks",
};

const ITEMS_PER_PAGE = 7; // Define how many items to load per request for specific categories

const MenuPage = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Current page (or category index for "All Menu")
  const [hasMore, setHasMore] = useState(true); // True if there's more data/categories to load

  // --- Intersection Observer for Infinite Scrolling ---
  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // If the last item is intersecting and there's more data, load next page/category
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // --- Data Fetching Logic ---
  const fetchItems = useCallback(
    async (category: string | null, currentPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();

        if (category === "All Menu") {
          // Special logic for "All Menu": paginate by category
          const categoriesInOrder = Object.values(categoryMapping);
          const categoryToFetch = categoriesInOrder[currentPage]; // currentPage acts as category index

          if (!categoryToFetch) {
            // No more categories left to fetch
            setHasMore(false);
            setLoading(false);
            return;
          }

          queryParams.append("category", categoryToFetch);
          queryParams.append("limit", "500"); // Fetch all items for this specific category (large limit)
          // No 'page' param for this specific category request, as we want all of it.

        } else {
          // Standard pagination for a single selected category
          queryParams.append("page", currentPage.toString());
          queryParams.append("limit", ITEMS_PER_PAGE.toString());
          queryParams.append("category", category || "");
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
          `Fetched page ${currentPage} for category "${category || "All Menu"}":`,
          data
        );

        if (currentPage === 0) {
          setItems(data); // First fetch (either first page of a specific category, or first category for "All Menu")
        } else {
          setItems((prevItems) => [...prevItems, ...data]); // Append data for subsequent loads
        }

        // Determine hasMore based on the selected category logic
        if (category === "All Menu") {
          const categoriesInOrder = Object.values(categoryMapping);
          // Has more if there are still categories left to fetch
          setHasMore(currentPage < categoriesInOrder.length - 1);
        } else {
          // For specific categories, hasMore based on ITEMS_PER_PAGE
          setHasMore(data.length === ITEMS_PER_PAGE);
        }
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

  // Effect to trigger initial fetch when a category is selected or changed
  useEffect(() => {
    if (selectedCategory !== null) {
      setItems([]); // Clear existing items for new selection
      setPage(0); // Reset page/category index
      setHasMore(true); // Assume there's more to load until proven otherwise
      fetchItems(selectedCategory, 0); // Fetch the first page/category
    }
  }, [selectedCategory, fetchItems]);

  // Effect to load more items when the 'page' state changes (triggered by observer)
  useEffect(() => {
    // Only fetch more if page is incremented, a category is selected, and there's more data/categories to load
    if (page > 0 && selectedCategory !== null && hasMore) {
      fetchItems(selectedCategory, page);
    }
  }, [page, selectedCategory, fetchItems, hasMore]);

  const handleCategoryClick = useCallback((category: string | null) => {
    setSelectedCategory(category);
  }, []);

  // Group fetched items by category for display
  const groupedItems = items.reduce(
    (acc: Record<string, FoodItem[]>, item) => {
      const categoryName =
        categoryMapping[item.category_id] || "Uncategorized";
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    },
    {}
  );

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

  return (
    <div
      className="min-h-screen bg-gray-100 p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url(/sec11.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="relative z-10 min-h-screen p-6">
        {/* Category Cards - Shown when no category is selected */}
        {!selectedCategory && (
          <div className="flex flex-wrap justify-center gap-10 mt-16">
            {[
              { label: "All Menu" },
              ...Object.values(categoryMapping).map((label) => ({ label })),
            ].map(({ label }) => (
              <CategoryCard
                key={`category-${label}`}
                label={label}
                imageUrl={categoryImages[label] || "/placeholder.jpg"}
                onClick={() => handleCategoryClick(label)}
              />
            ))}
          </div>
        )}

        {/* Selected Category View - Shown when a category is selected */}
        {selectedCategory && (
          <>
            <div className="flex justify-center mt-12">
              <button
                onClick={() => handleCategoryClick(null)}
                className="mt-12 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-full shadow-xl hover:scale-105 transition-transform"
                type="button"
              >
                ⬅️ Back to Categories
              </button>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl text-white font-bold mb-4">
                {selectedCategory}
              </h2>

              {/* Display categories in a specific order */}
              {Object.values(categoryMapping).map((categoryName) => {
                const itemsInCategory = groupedItems[categoryName];
                // Only render the category section if it has items that have been fetched
                if (!itemsInCategory || itemsInCategory.length === 0) return null;

                return (
                  <div key={categoryName} className="mb-8">
                    <h3 className="text-2xl text-white font-bold mb-4 text-center">
                      {categoryName}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {itemsInCategory.map((item) => {
                        // Attach ref to the absolute last item in the *entire* 'items' array
                        // This ensures infinite scroll triggers correctly, whether by item count or by category completion
                        const isLastItemOverall = items.length === items.indexOf(item) + 1;
                        return (
                          <div
                            key={`item-${item.item_id}`}
                            ref={isLastItemOverall ? lastItemElementRef : null}
                          >
                            <Card item={item} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Loading indicator and messages */}
              {loading && <SkeletonGrid />}
              {!loading && items.length === 0 && !hasMore && (
                <p className="text-white text-center mt-8 text-lg">
                  No items found for this category.
                </p>
              )}
              {!hasMore && !loading && items.length > 0 && (
                <p className="text-white text-center mt-8 text-lg">
                  You&apos;ve reached the end of the menu!
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Memoized category card component
const CategoryCard = React.memo(
  ({
    label,
    imageUrl,
    onClick,
  }: {
    label: string;
    imageUrl: string;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className="relative group w-80 h-96 rounded-3xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={label === "All Menu"}
      />
      <div className="absolute bottom-0 w-full h-[20%] bg-black/40 backdrop-blur-md rounded-b-xl p-4 flex items-center justify-center">
        <h2 className="text-2xl font-extrabold text-white drop-shadow-lg tracking-wider">
          {label}
        </h2>
      </div>
    </div>
  )
);

CategoryCard.displayName = "CategoryCard";

// Memoized card component for better performance
const Card = React.memo(({ item }: { item: FoodItem }) => (
  <div className="shadow-xl rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 bg-white/30 backdrop-blur-md hover:bg-white/40">
    <div className="relative w-full h-52">
      <Image
        src={item.image_url || "/placeholder.jpg"}
        alt={item.name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        loading="lazy"
      />
    </div>
    <div className="p-4 bg-black/30 text-white">
      <h4 className="text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 px-2 py-1 rounded-full inline-block mb-2">
        {categoryMapping[item.category_id] || "Uncategorized"}
      </h4>
      <h3 className="text-xl font-bold">{item.name}</h3>
      <p className="text-sm text-white/90">
        {item.description.length > 50
          ? `${item.description.slice(0, 50)}...`
          : item.description}
      </p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-lg font-bold text-red-400">${item.price}</span>
        <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md">
          🏷️ {item.quantity}
        </span>
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

// Optimized skeleton grid to match ITEMS_PER_PAGE for general loading indication
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12">
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
      <div
        key={`skeleton-${i}`}
        className="animate-pulse bg-white/20 rounded-xl h-80 w-full"
      />
    ))}
  </div>
);

export default MenuPage;