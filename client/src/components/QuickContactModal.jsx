import React, { useState } from "react";
import { submitContact } from "../services/contactServices";
import { toast } from "react-toastify";

const QuickContactModal = ({ setShowModal }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error("All fields are required");
    }

    try {
      await submitContact(form);
      toast.success("Message sent!");
      setForm({ name: "", email: "", message: "" });
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">💬 Quick Contact</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border p-2 rounded text-gray-800"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded text-gray-800"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Message"
          className="w-full border p-2 rounded text-gray-800"
          rows="3"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        ></textarea>
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="text-gray-600 hover:underline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#3ED6B5] text-white px-4 py-2 rounded hover:bg-[#2bb99f]"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuickContactModal;
