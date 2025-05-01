'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import EditUserSidebar from "@/app/components/editSidebar";

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  created_at: string;
}

export default function EditGalleryPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [message, setMessage] = useState('');
  const [videos, setVideos] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/gallery/events');
        if (response.status === 200) {
          setVideos(response.data);
        } else {
          setError('Failed to fetch videos.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setMessage('Please enter a valid YouTube URL');
      return;
    }

    try {
      const res = await axios.post('/api/gallery/add', {
        src: url,
        alt,
        title,
        category: 'event',
        type: 'video',
      });

      if (res.status === 200) {
        setMessage('YouTube video added successfully!');
        setUrl('');
        setTitle('');
        setAlt('');
        const newVideo = res.data.data;
        setVideos(prevVideos => [newVideo, ...prevVideos]);
      } else {
        setMessage('Failed to add video. Try again.');
      }
    } catch (err: any) {
      console.error(err);
      setMessage('Error adding video.');
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    try {
      const res = await axios.delete(`/api/gallery/delete/${videoId}`);
      if (res.status === 200) {
        setMessage('Video deleted successfully!');
        setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
      } else {
        setMessage('Failed to delete video.');
      }
    } catch (err: any) {
      console.error(err);
      setMessage('Error deleting video.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-black flex md:flex-row flex-col p-6 mt-32 space-y-8">
      <EditUserSidebar />
      <div className="flex-grow ">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-blue-600">
  Add and Manage Event Videos
</h1>


        {/* Add Video Form */}
        <div className="bg-white text-black rounded-xl p-8 shadow-xl max-w-3xl mx-auto ">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="text-blue-700 text-lg font-medium">YouTube URL</label>
              <input
                id="url"
                type="text"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100  text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="title" className="text-blue-700 text-lg font-medium">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="alt" className="text-blue-700 text-lg font-medium">Alt Text</label>
              <input
                id="alt"
                type="text"
                placeholder="Enter Alt Text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                required
                className="w-full border p-3 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Add Video
            </Button>
          </form>
          {message && <p className="mt-4 text-sm text-center text-white">{message}</p>}
        </div>

        {/* Display Videos */}
<div className="bg-white text-black rounded-xl p-8 shadow-xl max-w-4xl mx-auto mt-5">
  <h2 className="text-2xl font-semibold mb-6 text-blue-600 text-center">Uploaded Videos</h2>
  {loading ? (
    <p className="text-gray-400 text-center">Loading videos...</p>
  ) : error ? (
    <p className="text-red-400 text-center">{error}</p>
  ) : videos.length === 0 ? (
    <p className="text-gray-400 text-center">No videos uploaded yet.</p>
  ) : (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div
          key={video.id}
          className="flex flex-col items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="w-full">
            <p className="font-medium text-blue-600 text-lg mb-2">{video.title}</p>
            <p className="text-gray-500 text-sm mb-2">
              Uploaded: {new Date(video.created_at).toLocaleString()}
            </p>
            {video.src.startsWith('http') ? (
              <p className="text-blue-400 text-sm truncate">{video.src}</p>
            ) : (
              <p className="text-green-400 text-sm truncate">Local Video: {video.src}</p>
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteVideo(video.id)}
            className="bg-red-600 text-white p-2 rounded-full mt-4 hover:bg-red-700 transition"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </div>
  );
}
