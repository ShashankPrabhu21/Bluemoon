"use client";
import Image from "next/image";
import React, { useState } from "react";
// import { Mail, Phone } from "lucide-react";


const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    // Validation for name field - only letters and spaces
    if (id === 'name' && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    // Validation for email field
    if (id === 'phone' && value && !/^[0-9]+$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Form submitted successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert("Failed to submit the form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white">
      <div className="relative bg-white h-32 flex items-center justify-center -mt-8">       
      </div>

    <div className="container mx-auto px-4 py-12">
    <h2 className="text-center text-4xl font-bold text-white mb-8">CONTACT US</h2>
    <div className="flex flex-wrap md:flex-nowrap justify-between items-stretch mb-8">
  
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <Image
          src="/R.png"
          alt="Left Side Image"
          width={300}
          height={300}
          className="rounded-lg shadow-lg object-cover h-auto"
        />
      </div>

      {/* Assistance Section */}
      <div className="w-full md:w-[45%] text-white p-8 pr-[115px] flex flex-col justify-center text-center">
        <h3 className="text-3xl font-bold mb-4">Need Assistance?</h3>
        <p className="text-lg font-medium">
          We’re here to help! Whether you have a question about our menu,
          need assistance with reservations, or want to place an order, feel
          free to reach out. Call or SMS us anytime—we’d love to hear from
          you! 😊
        </p>
      </div>
    </div>

  {/* Forms Section */}
    <div className="flex flex-wrap md:flex-nowrap justify-center items-stretch gap-8">
      {/* Contact Form */}
      <div className="w-full md:w-[42%] bg-white text-blue-900 p-8 rounded-2xl shadow-2xl border border-gray-300">
        <h3 className="text-2xl font-bold mb-6 text-center">Contact Form</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold mb-2 text-base">Name</label>
            <input type="text" id="name" className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700" placeholder="Your Name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block font-semibold mb-2 text-base">Email</label>
              <input type="email" id="email" className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700" placeholder="Your Email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="phone" className="block font-semibold mb-2 text-base">Phone</label>
              <input type="text" id="phone" className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700" placeholder="Your Phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block font-semibold mb-2 text-base">Subject</label>
            <input type="text" id="subject" className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700" placeholder="Your Subject" value={formData.subject} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block font-semibold mb-2 text-base">Message</label>
            <textarea id="message" rows={3} className="w-full p-3 border border-gray-400 rounded-lg shadow-md text-base focus:outline-none focus:ring-2 focus:ring-blue-700" placeholder="Please enter your message..." value={formData.message} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="bg-blue-700 text-white text-base px-5 py-3 mt-2 rounded-lg hover:bg-blue-900 transition duration-200 w-full shadow-lg font-semibold">Submit</button>
        </form>
      </div>

    {/* Booking Information */}
      <div className="w-full md:w-[42%] bg-white text-blue-900 p-8 rounded-2xl shadow-2xl border border-gray-300">
        <h4 className="text-2xl font-bold text-center text-blue-900 mb-4">Booking Request</h4> 
        <p className="text-yellow-600 flex items-center justify-center gap-3 text-3xl font-bold mb-2">
          📞 0422 306 777
        </p>
        <p className="text-yellow-600 text-xl text-center font-semibold mb-6">📧 contact@bluemoonrestaurants.com </p>
        <div className="mt-4 text-center">
          <h4 className="text-2xl font-bold text-blue-900">Location</h4>
          <p className="text-yellow-600 text-lg font-medium">Bluemoon Restaurant<br />4 Station Street, Wentworthville</p>
        </div>
        {/* Breakfast */}
        <div className="mt-6 text-center">
          <h4 className="text-2xl font-bold text-blue-900">Breakfast Time</h4>
          <p className="text-yellow-600 text-lg font-medium">Monday to Sunday<br />7:00 AM to 9:00 AM</p>
        </div>
        {/* Lunch */}
        <div className="mt-6 text-center">
          <h4 className="text-2xl font-bold text-blue-900">Lunch Time</h4>
          <p className="text-yellow-600 text-lg font-medium">Monday to Sunday<br />11:00 AM to 2:00 PM</p>
        </div>
        {/* Dinner */}
        <div className="mt-6 text-center">
          <h4 className="text-2xl font-bold text-blue-900">Dinner Time</h4>
          <p className="text-yellow-600 text-lg font-medium">Monday to Sunday<br />6:00 PM to 10:00 PM</p>
        </div>
      </div>
    </div>
  </div>
</div>   
);
};

export default ContactUs;