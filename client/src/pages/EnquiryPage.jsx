import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const EnquiryPage = () => {
  const { state } = useLocation();
  const { vendorName, productName } = state || {};

  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
  
    alert(`Enquiry sent to ${vendorName} about ${productName}:\n\n${message}`);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Ask {vendorName}</h1>
      <p className="mb-2 text-gray-600">Product: <strong>{productName}</strong></p>
      <textarea
        rows={6}
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
      >
        Send Message
      </button>
    </div>
  );
};

export default EnquiryPage;
