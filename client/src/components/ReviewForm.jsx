import React, { useState } from "react";
import { toast } from "react-toastify";
import { addReview } from "../services/reviewServices";

const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.warning("Please provide a rating");
      return;
    }

    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (image) {
      formData.append("images", image); 
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      await addReview(formData);
      
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      setImage(null);
    } catch (err) {
      console.error("Review error:", err);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded p-4 mt-4 shadow space-y-4"
    >
      <label className="block font-medium text-gray-700">Rating</label>
      <div className="flex space-x-1 text-2xl">
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          return (
            <span
              key={i}
              className={`cursor-pointer ${
                starValue <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(null)}
            >
              ★
            </span>
          );
        })}
      </div>

      <div>
        <label className="block font-medium text-gray-700">Comment</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium text-gray-700">
          Upload Image (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="bg-[#A1E9D1] hover:bg-[#81dcc1] text-black px-4 py-2 rounded hover:bg-blue-700"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
