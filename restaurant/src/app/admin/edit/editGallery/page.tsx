"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditUserSidebar from "@/app/components/editSidebar";

const categories = [
  { id: "interior", name: "Interior" },
  { id: "dishes", name: "Signature Dishes" },
  { id: "events", name: "Events" },
  { id: "drinks", name: "Drinks" },
  { id: "videos", name: "Videos" }, // Added Videos category
];

interface GalleryItem {
  id: number;
  type: "image" | "video" | "youtube";
  src: string; // For image file path or YouTube URL
  alt?: string; // For images
  category: string;
  title: string;
}

const UploadGalleryImages = () => {
  const [mediaType, setMediaType] = useState<"image" | "video" | "youtube">("image");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadedItems, setUploadedItems] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchUploadedItems = async () => {
      try {
        const res = await fetch("/api/gallery/get"); // Assuming this endpoint will now return all types
        if (!res.ok) {
          throw new Error("Failed to fetch uploaded items");
        }
        const data = await res.json();
        setUploadedItems(data.items); // Assuming the response is { items: [...] }
      } catch (err) {
        console.error("Error fetching uploaded items:", err);
      }
    };
    fetchUploadedItems();
  }, [successMsg]);

  const handleMediaTypeChange = (type: "image" | "video" | "youtube") => {
    setMediaType(type);
    setFile(null);
    setPreview(null);
    setYoutubeUrl("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!category || !title) {
      alert("Please fill category and title.");
      return;
    }

    const formData = new FormData();
    formData.append("type", mediaType); // <--- Add this line
    formData.append("category", category);
    formData.append("title", title);

    if (mediaType === "image" && file && alt) {
      formData.append("image", file);
      formData.append("alt", alt);
    } else if (mediaType === "video" && file) {
      formData.append("video", file);
    } else if (mediaType === "youtube" && youtubeUrl) {
      formData.append("url", youtubeUrl);
    } else if (mediaType === "image" && !file) {
      alert("Please select an image.");
      return;
    } else if (mediaType === "video" && !file) {
      alert("Please select a video file.");
      return;
    } else if (mediaType === "youtube" && !youtubeUrl) {
      alert("Please provide a YouTube URL.");
      return;
    }

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

      setSuccessMsg("Item uploaded successfully!");
      setFile(null);
      setPreview(null);
      setYoutubeUrl("");
      setCategory("");
      setTitle("");
      setAlt("");
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error uploading item: ${err.message}`);
      } else {
        alert("An unknown error occurred during upload.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      setUploadedItems((prev) => prev.filter((item) => item.id !== id));
      alert("Item deleted successfully!");
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Error deleting item.");
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setMediaType(item.type);
    setCategory(item.category);
    setTitle(item.title);
    setAlt(item.alt || "");
    setYoutubeUrl(item.type === "youtube" ? item.src : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    const updateData: { category: string; title: string; alt?: string; src?: string; type: "image" | "video" | "youtube" } = {
      category,
      title,
      type: editingItem.type,
    };

    if (editingItem.type === "image") {
      updateData.alt = alt;
    } else if (editingItem.type === "youtube") {
      updateData.src = youtubeUrl;
    }

    try {
      await fetch(`/api/gallery/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      setUploadedItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, category, title, alt, src: editingItem.type === "youtube" ? youtubeUrl : item.src } : item
        )
      );
      setEditingItem(null);
      setMediaType("image");
      setCategory("");
      setTitle("");
      setAlt("");
      setYoutubeUrl("");
      alert("Item updated successfully!");
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Error updating item.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen mt-24 bg-gradient-to-br from-gray-800 to-black">
      <EditUserSidebar />
      <div className="flex-1 flex flex-col items-center mt-12">
        <div className="backdrop-blur-md bg-[#2c2f45]/70 border border-gray-600 rounded-3xl shadow-lg p-6 mb-8 max-w-xl w-full">
          <h1 className="text-4xl sm:text-4xl font-bold text-center text-blue-700 drop-shadow-sm mb-10">
            <span role="img" aria-label="camera">📸</span> Upload Gallery Item
          </h1>
          <div className="flex justify-center">
            <div className="space-y-6 w-full">
              {editingItem ? (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-blue-400">
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
                    <label className="block mb-2 text-sm font-medium text-blue-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Cozy Dining Area or Event Highlight"
                    />
                  </div>

                  {editingItem.type === "image" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-blue-400">
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
                  )}

                  {editingItem.type === "youtube" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-800">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX"
                      />
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <button
                      onClick={handleUpdate}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 px-6 py-2 rounded-xl text-white font-semibold transition-all"
                    >
                      Update Item
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-xl text-white font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-blue-400">
                      Media Type
                    </label>
                    <select
                      value={mediaType}
                      onChange={(e) => handleMediaTypeChange(e.target.value as "image" | "video" | "youtube")}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="youtube">YouTube URL</option>
                    </select>
                  </div>

                  {mediaType === "image" && (
                    <>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-blue-400">
                          Select Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="text-gray-800"
                        />
                      </div>
                      {preview && (
                        <div>
                          <p className="mb-2 text-sm text-gray-800">Preview</p>
                          <Image
                            src={preview}
                            alt="Image Preview"
                            width={500}
                            height={300}
                            className="rounded-xl border border-gray-600 shadow-lg"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-blue-400">
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
                  )}

                  {mediaType === "video" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-blue-400">
                        Select Video
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="text-gray-800"
                      />
                      {preview && (
                        <div>
                          <p className="mb-2 text-sm text-gray-800">Preview</p>
                          <video src={preview} controls className="rounded-xl border border-gray-600 shadow-lg w-full max-w-md"></video>
                        </div>
                      )}
                    </div>
                  )}

                  {mediaType === "youtube" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-blue-400">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-2 text-sm font-medium text-blue-400">
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
                    <label className="block mb-2 text-sm font-medium text-blue-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Cozy Dining Area or Event Highlight"
                    />
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all"
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

        {/* Uploaded Items */}
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-3xl font-semibold mb-6 text-center text-blue-700">
            📂 Uploaded Items
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {uploadedItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden shadow-lg flex flex-col hover:shadow-2xl transition-shadow duration-300 group"
              >
                {item.type === "image" && (
                  <div className="w-full h-[250px] relative">
                    <Image
                      src={`data:image/*;base64,${item.src}`}
                      alt={item.alt || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {item.type === "video" && (
                  <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">
                    <video
                      src={`data:video/mp4;base64,${item.src}`} // Try a specific MIME type
                      controls
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                {item.type === "youtube" && (
                  <div className="w-full h-[250px]">
                    <iframe
                      src={`https://www.youtube.com/embed/${new URL(item.src).searchParams.get("v")}`}
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                )}

                <div className="flex justify-center gap-3 mt-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded shadow transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow transition-all"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-center text-sm text-gray-800 font-semibold px-4 py-2 mt-2 w-full transition-colors duration-200 group-hover:bg-blue-800 group-hover:text-white">
                  {item.title}
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