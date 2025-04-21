//cooking/page.tsx:
'use client';
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

type Video = {
  id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
};

export default function CookingVideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/getvideo");
        const data: Video[] = await res.json();
        setVideos(data);
        setFilteredVideos(data);
        setSelectedVideo(data[0] || null);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  const handleSearch = () => {
    const results = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVideos(results);
    if (results.length > 0) setSelectedVideo(results[0]);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    const filtered =
      cat === "All" ? videos : videos.filter((video) => video.category === cat);
    setFilteredVideos(filtered);
    if (filtered.length > 0) setSelectedVideo(filtered[0]);
  };

  return (
    <div className="min-h-screen relative text-[#3345A7] flex flex-col items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/base.jpg')" }}>
      
      <div className="min-h-screen w-full bg-black/60 flex flex-col items-center text-white px-4 pt-24">
        <h2 className="text-3xl font-bold text-white text-center mb-6 px-6 py-3 rounded-lg mt-10">
          🍳 Cooking Videos
        </h2>

        {/* 🔍 Search */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-md text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 px-4 py-2 rounded-md"
          >
            Search
          </button>
        </div>

        {/* 🗂 Categories */}
        <div className="flex gap-4 mb-6">
          {["All", "Veg", "Non-Veg", "Dessert", "Breakfast"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-md ${category === cat ? "bg-green-500" : "bg-gray-500"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🎞 Main Video */}
        {selectedVideo && (
          <div className="max-w-3xl w-full bg-white p-4 rounded-lg shadow-md border border-gray-300 text-black">
            <div className="w-full flex justify-center">
            <ReactPlayer
              url={selectedVideo.video_url}
              controls
              width="640px"
              height="360px"
              className="rounded-lg"
            />
          </div>

            <h3 className="mt-3 text-md font-semibold text-gray-700 text-center">
              {selectedVideo.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 text-center">
              {selectedVideo.description}
            </p>
          </div>
        )}

        {/* 🧱 Video Grid */}
        <div className="max-w-5xl w-full mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
          {filteredVideos.map((video, index) => (
            <div
              key={index}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer bg-white p-3 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition flex flex-col items-center"
              style={{ width: "220px" }}
            >
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-full h-32 object-cover rounded-md"
              />
              <h4 className="text-sm font-medium text-gray-700 mt-2 text-center">{video.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}