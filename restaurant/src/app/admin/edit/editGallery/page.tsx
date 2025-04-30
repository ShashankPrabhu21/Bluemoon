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
    src: string; // Cloudinary URL for image/video, or YouTube URL
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
    const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false); // Track Cloudinary upload

    useEffect(() => {
        const fetchUploadedItems = async () => {
            try {
                const res = await fetch("/api/gallery/get");
                if (!res.ok) {
                    throw new Error("Failed to fetch uploaded items");
                }
                const data = await res.json();
                setUploadedItems(data.items);
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

    const uploadToCloudinary = async (file: File, resourceType: "image" | "video") => {
        setUploadingToCloudinary(true);
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET; // You might want separate presets for video

        if (!cloudName || !uploadPreset) {
            alert("Cloudinary configuration is missing.");
            setUploadingToCloudinary(false);
            return null;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
       

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || `Cloudinary ${resourceType} upload failed`);
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error uploading ${resourceType} to Cloudinary:`, error);
                alert(`Failed to upload ${resourceType}: ${error.message}`);
            } else {
                console.error(`Unknown error uploading ${resourceType} to Cloudinary:`, error);
                alert(`Failed to upload ${resourceType}: Unknown error`);
            }
            return null;
        }
         finally {
            setUploadingToCloudinary(false);
        }
    };

    const handleUpload = async () => {
      if (!category || !title) {
        alert("Please fill category and title.");
        return;
      }
    
      setLoading(true);
      const formData = new FormData();
      formData.append("type", mediaType);
      formData.append("category", category);
      formData.append("title", title);
      if (alt) {
        formData.append("alt", alt);
      }
    
      try {
        if (mediaType === "image" && file) {
          const imageUrl = await uploadToCloudinary(file, "image");
          if (imageUrl) {
            formData.append("image", file);
            formData.append("src", imageUrl);
          } else {
            throw new Error("Image upload to Cloudinary failed.");
          }
        } else if (mediaType === "video" && file) {
          // ✅ Add the video size check here
          if (file.size > 100 * 1024 * 1024) {
            alert("Video must be less than 100MB");
            setLoading(false);
            return;
          }
    
          const videoUrl = await uploadToCloudinary(file, "video");
          if (videoUrl) {
            formData.append("video", file);
            formData.append("src", videoUrl);
          } else {
            throw new Error("Video upload to Cloudinary failed.");
          }
        } else if (mediaType === "youtube" && youtubeUrl) {
          formData.append("url", youtubeUrl);
        } else {
          alert(`Please provide a ${mediaType}.`);
          setLoading(false);
          return;
        }
    
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
                                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
                                disabled={loading || uploadingToCloudinary}
                                className="w-full bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all"
                            >
                                {loading ? "Uploading..." : uploadingToCloudinary ? "Uploading to Cloudinary..." : "Upload"}
                            </button>

                            {successMsg && (
                                <p className="text-green-400 font-semibold text-center mt-4">
                                    {successMsg}
                                </p>
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
                                            src={item.src || "/placeholder.jpg"} // Use Cloudinary URL
                                            alt={item.alt || ""}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                {item.type === "video" && (
                                    <div className="w-full h-[300px] relative overflow-hidden rounded-lg shadow-md transition-opacity group-hover:opacity-80">
                                        <video
                                            src={item.src || "/placeholder_video.mp4"} // Use Cloudinary URL
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