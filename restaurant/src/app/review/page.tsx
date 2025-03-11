'use client';

import { useEffect, useState } from "react";
import { Star, StarHalf, Utensils, Clock, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';

interface Review {
    id: number;
    name: string;
    rating: number;
    comment: string;
    date: string;
    gender?: string;
  }

export default function Reviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [gender, setGender] = useState("");


    useEffect(() => {
        // Load reviews from localStorage on page load
        const storedReviews = localStorage.getItem("reviews");
        if (storedReviews) {
          setReviews(JSON.parse(storedReviews));
        }
      }, []);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !comment) return alert("Please enter all fields!");
    
        const newReview: Review = {
          id: Date.now(),
          name,
          rating,
          comment,
          date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
          gender,
        };

        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
    
        // Store in localStorage
        localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    
        // Clear input fields
        setName("");
        setComment("");
        setRating(5);
        setGender("");
  };

  const StarRating = ({ rating }: { rating: number }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-5 h-5 fill-primary text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-5 h-5 fill-primary text-primary" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-star-${i}`}
          className="w-5 h-5 text-gray-300"
        />
      );
    }

    return <div className="flex gap-1">{stars}</div>;
  };

  

  return (
    <div className="min-h-screen bg-background ">
      <div className="relative h-80 bg-cover bg-center bg-[url('/sec11.jpg')]">
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60 mt-32"></div>
        <div className="flex justify-center">
                <div className="bg-primary/20 p-4 rounded-full backdrop-blur-sm border border-primary/30 mt-36">
                    <Utensils className="w-8 h-8  text-white" />
                </div>
                </div>
        {/* Title & Subtitle - Move to the top */}
        <div className="absolute  left-1/2 transform -translate-x-1/2 text-center text-white">
            <h1 className="text-5xl font-bold">Bluemoon Reviews</h1>
            <p className="text-xl font-light mt-3">Share Your Culinary Journey</p>
        </div>
    </div>


      <div className="bg-card border-b  z-0 backdrop-blur-sm bg-card/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
          <div className="relative z-10 flex justify-center items-center gap-2 text-gray-600 py-6 text-lg">
                <Link href="/" className="hover:text-gray-900 transition-all duration-200">
                    <span className="flex items-center gap-1">🏠 Home</span>
                </Link>
                <span className="text-gray-800">›</span>
                <span className="text-gray-600 font-small">Reviews</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <Clock className="w-4 h-4 inline mr-1" />Open Daily: 8:00 AM - 11:00 PM
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card className="p-10 mb-12 bg-card/50 backdrop-blur-sm border-2 border-primary/20 rounded-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="text-center ">
              <Utensils className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary">Share Your Experience</h2>
              <p className="text-muted-foreground mt-2">Let others know about your dining adventure</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-background/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Gender</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-background/50 backdrop-blur-sm border rounded-md p-2"
                    required
                >
                    <option value="" disabled>Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                </div>

            </div>
            
            <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Your Rating</label>
                <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                        key={value}
                        type="button"
                        variant="outline"
                        onClick={() => setRating(value)}
                        className={`p-3 transition-all hover:scale-110 ${
                        rating >= value ? "bg-transparent" : "hover:border-primary"
                        }`}
                    >
                        <Star
                        className={`w-6 h-6 transition-all ${
                            rating >= value ? "fill-gold text-gold" : "stroke-gray-400 text-gray-400"
                        }`}
                        style={{ fill: rating >= value ? "#FFD700" : "none", stroke: rating >= value ? "#FFD700" : "#A0A0A0" }}
                        />
                    </Button>
                    ))}
                </div>
                </div>


            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">Your Experience</label>
              <Textarea
                placeholder="Tell us about your dining experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className="w-full h-32 bg-background/50 backdrop-blur-sm"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full text-lg text-white py-6 bg-blue-800 hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              Share Your Review
            </Button>
          </form>
        </Card>



        <div className="space-y-6">
            {reviews.map((review) => {
            const profileImg = review.gender?.trim().toLowerCase() === "male" ? "/male.png" : "/female.png";
            
            return (
                <Card key={review.id} className="p-6 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            {/* Gender Icon */}
                            <img src={profileImg} alt="Gender Icon" className="w-6 h-6 object-contain" />
                            <div>
                                <h3 className="text-lg font-semibold">{review.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="w-4 h-4 inline" /> {review.date}
                                </p>
                                
                            </div>
                        </div>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-4 italic text-gray-700">{review.comment}</p>
                </Card>
            );
        })}
        </div>        
      </div>
    </div>
  );
}