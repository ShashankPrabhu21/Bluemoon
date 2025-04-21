'use client';

import { useState } from "react";
import EditUserSidebar from "@/app/components/editSidebar";

export default function CookingVideoEdit() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Veg",
  });
  const [uploadStatus, setUploadStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async () => {
    if (!videoFile) {
      alert("Please select a video file");
      return;
    }

    setUploadStatus("Uploading to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", "unsigned_preset");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dc0mrjkjy/video/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok || !cloudinaryData.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      const videoUrl = cloudinaryData.secure_url;
      const thumbnailUrl = videoUrl
        .replace("/upload/", "/upload/so_1/")
        .replace(/\.\w+$/, ".jpg");

      const saveRes = await fetch("/api/savemetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save metadata");
      }

      setUploadStatus("✅ Upload successful!");
      setVideoUrl(videoUrl);
      setForm({ title: "", description: "", category: "Veg" });
      setVideoFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setUploadStatus(`❌ Upload failed: ${err.message}`);
      } else {
        console.error("An unknown error occurred");
        setUploadStatus("❌ Upload failed: An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-800 to-black text-white mt-24">
      <EditUserSidebar />

      <div className="flex-1 flex justify-center items-start py-16 px-6 sm:px-10 md:px-16">
        <div className="w-full max-w-3xl backdrop-blur-md bg-[#2c2f45]/70 border border-gray-600 p-6 sm:p-10 rounded-2xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-700 font-bold">🍽️ Upload Cooking Video</h2>

          <div className="space-y-5">
            <input
              type="text"
              name="title"
              placeholder="Video Title"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <textarea
              name="description"
              placeholder="Video Description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 rounded-lg text-black resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
              <option value="Dessert">Dessert</option>
              <option value="Breakfast">Breakfast</option>
            </select>

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 hover:file:cursor-pointer"
            />

            <button
              onClick={handleVideoUpload}
              className="w-full bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg text-white text-lg font-semibold transition cursor-pointer"
              disabled={!videoFile || !form.title || !form.description}
            >
              Upload Video
            </button>

            {uploadStatus && (
              <p className="text-center text-sm text-gray-300">{uploadStatus}</p>
            )}

            {videoUrl && (
              <div className="pt-6">
                <h3 className="text-xl font-semibold mb-3">🎉 Uploaded Video Preview:</h3>
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-xl border border-gray-600"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
