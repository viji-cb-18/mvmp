import React, { useState } from "react";
import { toast } from "react-toastify";
import { submitContact } from "../services/contactServices"; 

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name || !formData.email || !formData.message) {
      return toast.error("All fields are required");
    }

    if (!emailRegex.test(formData.email)) {
      return toast.error("Invalid email address");
    }

    try {
      await submitContact(formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-[#2D70E4]">📞 Contact Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      

        <div className="bg-[#F3F8FD] p-6 rounded-xl shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Get in Touch</h3>
          <p className="text-gray-600">
            We’d love to hear from you. Reach out anytime!
          </p>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li><strong>📧 Email:</strong> support@nezicart.com</li>
            <li><strong>📞 Phone:</strong> +971-123-4567</li>
            <li><strong>📍 Address:</strong> Office 123, NeziCart HQ, Dubai, UAE</li>
            <li><strong>🕒 Working Hours:</strong> 9 AM – 6 PM (Mon–Fri)</li>
          </ul>
        </div>

    
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100"
        >
          <input
            type="text"
            placeholder="Your Name"
            className="border p-3 rounded w-full text-gray-800"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-3 rounded w-full text-gray-800"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="border p-3 rounded w-full text-gray-800"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
          <button
            type="submit"
            className="w-full bg-[#3ED6B5] text-white px-4 py-2 rounded hover:bg-[#31b9a1]"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;

