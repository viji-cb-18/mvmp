import React, { useState } from "react";
import { requestOrderReturn } from "../services/orderServices";
import { toast } from "react-toastify";

const ReturnRequestModal = ({ orderId, productId, onClose, onSuccess }) => {
  const [reason, setReason] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return toast.error("Please provide a reason");

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("reason", reason);
    if (imageFile) formData.append("image", imageFile);

    try {
      await requestOrderReturn(orderId, formData);
      toast.success("Return requested");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Request failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">📦 Return Product</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows="4"
            className="w-full border rounded p-2"
            placeholder="Reason for return"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#3ED6B5] text-white px-4 py-2 rounded hover:bg-[#2cb398]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequestModal;
