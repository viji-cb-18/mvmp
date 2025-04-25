import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import QuickContactModal from "./QuickContactModal";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="bg-[#0F172A] text-gray-300">
      
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 border-b border-gray-700">
       
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">NeziCart</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted marketplace for electronics, fashion, and more.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-[#3ED6B5]"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#3ED6B5]"><FaTwitter /></a>
            <a href="#" className="hover:text-[#3ED6B5]"><FaInstagram /></a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#3ED6B5] transition">Home</Link></li>
            
            <li><Link to="/best-sellers" className="hover:text-[#3ED6B5] transition">Best Sellers</Link></li>
            <li><Link to="/new-arrivals" className="hover:text-[#3ED6B5] transition">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-[#3ED6B5] transition">About Us</Link></li>
            <li><Link to="/orders" className="hover:text-[#3ED6B5] transition">My Orders</Link></li>
            <li><Link to="/contact" className="hover:text-[#3ED6B5] transition">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">💬 Quick Contact</h3>
          <p className="text-sm text-gray-400 mb-2">Have a question? Reach out instantly.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-2 inline-block bg-[#3ED6B5] hover:bg-[#31b9a1] text-white px-4 py-2 rounded text-sm transition"
          >
            Quick Contact
          </button>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} NeziCart. All rights reserved.
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <QuickContactModal setShowModal={setShowModal} />
        </div>
      )}
    </footer>
  );
};

export default Footer;
