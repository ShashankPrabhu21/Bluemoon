"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditUserSidebar from "@/app/components/editSidebar";

const categories = [
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

const UploadGalleryImages = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadedImages, setUploadedImages] = useState<GalleryImage[]>([]);
  const [editingImage, ] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const res = await fetch("/api/gallery/get");
        if (!res.ok) {
          throw new Error("Failed to fetch uploaded images");
        }
        const data = await res.json();
        setUploadedImages(data.images);
      } catch (err) {
        console.error("Error fetching uploaded images:", err);
      }
    };
    fetchUploadedImages();
  }, [successMsg]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file || !category || !title || !alt) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("alt", alt);

    try {
      setLoading(true);
      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Upload failed");
      }

      setSuccessMsg("Image uploaded successfully!");
      setFile(null);
      setPreview(null);
      setCategory("");
      setTitle("");
      setAlt("");
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error uploading image: ${err.message}`);
      } else {
        alert("An unknown error occurred during upload.");
      }
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-24">  
      <EditUserSidebar />   
      <div className="flex-1 flex flex-col items-center mt-12"> {/* Changed to flex-col and items-center */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 max-w-xl w-full">   
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-800 drop-shadow-sm mb-10">
            <span role="img" aria-label="camera">📸</span> Upload Gallery Image
        </h1>  
          <div className="flex justify-center">
            <div className="space-y-6 w-full">
              {editingImage ? (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Cozy Dining Area"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Restaurant interior view"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Select Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-gray-800"
                    />
                  </div>

                  {preview && (
                    <div>
                      <p className="mb-2 text-sm text-gray-800">Preview</p>
                      <Image
                        src={preview}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="rounded-xl border border-gray-600 shadow-lg"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Cozy Dining Area"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-800">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Restaurant interior view"
                    />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>

                  {successMsg && (
                    <p className="text-green-400 font-semibold text-center mt-4">
                      {successMsg}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

         {/* Uploaded Images */}
         <div className="mt-12 w-full max-w-4xl"> {/* Added w-full and max-w-4xl */}
          <h3 className="text-2xl font-semibold mb-6 text-center">
            📂 Uploaded Images
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className="rounded-lg overflow-hidden shadow-lg flex flex-col hover:shadow-2xl transition-shadow duration-300 group"
              >
                <div className="w-full h-[250px] relative">
                  <Image
                    src={`data:image/*;base64,${image.src}`}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>

               

                <div className="text-center text-sm text-gray-800 font-semibold px-4 py-2 mt-2 w-full transition-colors duration-200 group-hover:bg-blue-800 group-hover:text-white">
                  {image.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGalleryImages;