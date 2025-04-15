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

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
}

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery/get");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data && data.images) {
          setGalleryImages(data.images);
        } else {
          setGalleryImages([]);
        }
      } catch (error) {
        console.error("Failed to load gallery images", error);
        setGalleryImages([]);
      }
    };
    fetchImages();
  }, []);

  const filteredImages =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => {
    const globalIndex = galleryImages.findIndex(
      (img) => img.src === filteredImages[index].src
    );
    setCurrentImage(globalIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const goToPrevious = () =>
    setCurrentImage((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
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

  // Function to group images into rows of 4
  const groupImagesIntoRows = (images: GalleryImage[]) => {
    const rows = [];
    for (let i = 0; i < images.length; i += 4) {
      rows.push(images.slice(i, i + 4));
    }
    return rows;
  };

  const imageRows = groupImagesIntoRows(filteredImages);

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
        <div className="flex justify-center gap-4 py-4">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-lg transition-all ${
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

      {/* Image Grid */}
      <div className="w-full">
        {imageRows.map((row, rowIndex) => (
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
              {row.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer"
                  onClick={() => openLightbox(rowIndex * 4 + index)}
                >
                  <div className="w-full h-[300px] relative">
                    <Image
                      src={`data:image/*;base64,${image.src}`}
                      alt={image.alt}
                      fill
                      className="rounded-lg shadow-md transition-opacity group-hover:opacity-80 object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center text-white p-2 opacity-0 group-hover:opacity-100 transition-all">
                    {image.title}
                  </div>
                </div>
              ))}
            </div>
            {/* Add the fixed background between each row with reduced height */}
            {rowIndex < imageRows.length - 1 && (
              <div
                className="w-full h-[200px] bg-cover bg-center" // reduced height to 200px
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url('/sec2.jpg')",
                  backgroundAttachment: "fixed",
                }}
              ></div>
            )}
          </React.Fragment>
        ))}
        {/* Removed the extra h-40 div */}
      </div>

      {lightboxOpen && galleryImages[currentImage] && (
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
          <Image
            src={`data:image/*;base64,${galleryImages[currentImage].src}`}
            alt={galleryImages[currentImage].alt}
            width={800}
            height={600}
            className="rounded-lg shadow-lg object-contain max-h-[600px]"
          />
          <button className="absolute right-5 text-white" onClick={goToNext}>
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </main>
  );
};

export default Gallery;