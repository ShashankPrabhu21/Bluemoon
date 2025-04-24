"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const categories = [
  { id: "all", name: "All" },
  { id: "interior", name: "Interior" },
  { id: "dishes", name: "Signature Dishes" },
  { id: "events", name: "Events" },
  { id: "drinks", name: "Drinks" },
];

interface GalleryItem {
  id: number;
  type: "image" | "video" | "youtube";
  src: string; // For image base64, video base64, or YouTube URL
  alt?: string; // For images
  category: string;
  title: string;
}

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchGalleryItems = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const res = await fetch("/api/gallery/get");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data && data.items) {
          // Simulate a delay, remove this in production
          setTimeout(() => {
            setGalleryItems(data.items);
            setLoading(false); // Set loading to false after data is loaded
          }, 500);

        } else {
          setGalleryItems([]);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load gallery items", error);
        setGalleryItems([]);
        setLoading(false); // Set loading to false on error as well
      }
    };
    fetchGalleryItems();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    const globalIndex = galleryItems.findIndex(
      (item) => item.src === filteredItems[index].src && item.type === filteredItems[index].type
    );
    setCurrentImageIndex(globalIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentImageIndex((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") closeLightbox();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const groupItemsIntoRows = (items: GalleryItem[]) => {
    const rows = [];
    for (let i = 0; i < items.length; i += 4) {
      rows.push(items.slice(i, i + 4));
    }
    return rows;
  };

  const itemRows = groupItemsIntoRows(filteredItems);

  return (
    <main className="relative w-full text-white">
      {/* Hero Section */}
      <div
        className="relative w-full bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec22.jpg')",
        }}
      >
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold mb-4 mt-24">Our Gallery</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto">
            Experience the elegant ambiance and exquisite cuisine of Bluemoon
            Restaurant through our gallery.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 md:gap-4 py-4 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all text-xs md:text-sm whitespace-nowrap ${
                activeCategory === category.id
                  ? "bg-blue-500"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Background Image & Gap */}
      {activeCategory === "all" && (
        <div
          className="absolute top-1/2 left-0 w-full h-[400px] bg-cover bg-center z-[-1]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
            backgroundAttachment: "fixed",
          }}
        ></div>
      )}

      {/* Item Grid */}
      <div className="w-full">
        {loading ? (
          <div className="text-center py-8">Loading...</div> // Show loading message
        ) : (
          itemRows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div
                className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-cover bg-center"
                style={{
                  backgroundImage:
                    rowIndex % 2 === 0
                      ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec11.jpg')"
                      : "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec4.jpg')",
                }}
              >
                {row.map((item, index) => (
                  <div
                    key={item.id}
                    className="relative group cursor-pointer"
                    onClick={() => openLightbox(rowIndex * 4 + index)}
                  >
                    <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">
                      {item.type === "image" && (
                        <Image
                          src={`data:image/*;base64,${item.src}`}
                          alt={item.alt || item.title}
                          fill
                          className="object-cover"
                          priority={rowIndex < 1 && index < 4}
                        />
                      )}
                      {item.type === "video" && (
                        <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">

                          <video
                            src={`data:video/mp4;base64,${item.src}`} //added video/mp4
                            controls
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      {item.type === "youtube" && (
                        <iframe
                          src={`https://www.youtube.com/embed/${new URL(item.src).searchParams.get("v")}`}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
              {rowIndex < itemRows.length - 1 && (
                <div
                  className="w-full h-[200px] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
                    backgroundAttachment: "fixed",
                  }}
                ></div>
              )}
            </React.Fragment>
          ))
        )}
      </div>

      {lightboxOpen && galleryItems[currentImageIndex] && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button
            className="absolute top-5 right-5 text-white"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>
          <button className="absolute left-5 text-white" onClick={goToPrevious}>
            <ChevronLeft size={48} />
          </button>
          <div className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg bg-black flex items-center justify-center">
            {galleryItems[currentImageIndex].type === "image" && (
              <Image
                src={`data:image/*;base64,${galleryItems[currentImageIndex].src}`}
                alt={galleryItems[currentImageIndex].alt || galleryItems[currentImageIndex].title}
                width={1200}
                height={800}
                className="object-contain"
                priority // Add priority for the initially visible image

              />
            )}
            {galleryItems[currentImageIndex].type === "video" && (
              <video
                src={`data:video/*;base64,${galleryItems[currentImageIndex].src}`}
                controls
                className="object-contain w-full h-full"
              />
            )}
            {galleryItems[currentImageIndex].type === "youtube" && (
              <iframe
                src={`https://www.youtube.com/embed/${new URL(galleryItems[currentImageIndex].src).searchParams.get("v")}?autoplay=1&mute=1`}
                title={galleryItems[currentImageIndex].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            )}
          </div>
          <button className="absolute right-5 text-white" onClick={goToNext}>
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </main>
  );
};

export default Gallery;

