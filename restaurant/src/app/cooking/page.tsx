'use client';
import { useState } from "react";


export default function CookingVideosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [videos, setVideos] = useState([
    {
      title: "A Feast for the Senses!",
      description: "Behold this mouthwatering dish, rich in vibrant colors and bold flavors.",
      videoUrl: "https://www.youtube.com/embed/HU3wAPrJ-I8",
      thumbnail: "https://img.youtube.com/vi/HU3wAPrJ-I8/0.jpg",
      category: "Non-Veg",
    },
    {
      title: "Tasty and Quick Breakfast!",
      description: "Start your morning with this easy and delicious breakfast recipe.",
      videoUrl: "https://www.youtube.com/embed/jIurvPodGB8",
      thumbnail: "https://img.youtube.com/vi/jIurvPodGB8/0.jpg",
      category: "Breakfast",
    },
    {
      title: "Dessert Delights!",
      description: "Indulge in this heavenly dessert that's sweet and creamy.",
      videoUrl: "https://www.youtube.com/embed/yIwmm0DTEnE",
      thumbnail: "https://img.youtube.com/vi/yIwmm0DTEnE/0.jpg",
      category: "Dessert",
    },
    {
      title: "Spicy Chicken Curry!",
      description: "Enjoy this authentic, spicy, and aromatic chicken curry recipe.",
      videoUrl: "https://www.youtube.com/embed/j7rwYulP9zI",
      thumbnail: "https://img.youtube.com/vi/j7rwYulP9zI/0.jpg",
      category: "Non-Veg",
    },
  ]);
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [category, setCategory] = useState("All");

  // Fetch from YouTube if no local match is found
  const fetchFromYouTube = async (query: string) => {
    const API_KEY = "YOUR_YOUTUBE_API_KEY";
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=5&key=${API_KEY}`
    );
    const data = await response.json();
    const newVideos = data.items.map((item: { snippet: { title: string; description: string; thumbnails: { high: { url: string } } }; id: { videoId: string } }) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.high.url,
      category: "External",
    }));
    setVideos(newVideos);
  };

  const handleSearch = () => {
    const filteredVideos = videos.filter((video) =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredVideos.length > 0) {
      setVideos(filteredVideos);
    } else {
      fetchFromYouTube(searchTerm);
    }
  };

  return (
    <div className="min-h-screen relative text-[#3345A7] flex flex-col items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/base.jpg')" }}>
      
      {/* Content Wrapper */}
      <div className="min-h-screen w-full bg-black/50 flex flex-col items-center text-white px-4 pt-24">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-6  px-6 py-3 rounded-lg">
         <br/> 🍳 Cooking Videos
        </h2>

        {/* Search & Categories */}
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

        <div className="flex gap-4 mb-6">
          {["All", "Veg", "Non-Veg", "Dessert", "Breakfast"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-md ${category === cat ? "bg-green-500" : "bg-gray-500"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Video */}
      {/* Main Video */}
      <div className="max-w-3xl w-full bg-white p-4   rounded-lg shadow-md border border-gray-300 text-black">
        <iframe
          className="w-full h-[280px] md:h-[300px] rounded-lg shadow-lg border border-gray-300"
          src={selectedVideo.videoUrl}
          title="Selected Cooking Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
        <h3 className="mt-3 text-md font-semibold text-gray-700 text-center">{selectedVideo.title}</h3>
        <p className="text-gray-600 text-sm mt-1 text-center">{selectedVideo.description}</p>
      </div>



        {/* Video List */}
        <div className="max-w-5xl w-full mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos
            .filter((video) => category === "All" || video.category === category)
            .map((video, index) => (
              <div
                key={index}
                onClick={() => setSelectedVideo(video)}
                className="cursor-pointer bg-white p-3 rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition flex flex-col items-center"
                style={{ width: "220px" }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h4 className="text-sm font-medium text-gray-700 mt-2 text-center">{video.title}</h4>
              </div>
            ))}<br/>
        </div>
      </div>
    </div>
  );
}
