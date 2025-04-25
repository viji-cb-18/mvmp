import React, { useEffect, useState } from "react";
import { getReviewsByProductId } from "../services/reviewServices";
import { toast } from "react-toastify";

const StarRating = ({ value }) => {
  const filledStars = Math.round(value);
  return (
    <div className="flex items-center space-x-1 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < filledStars ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await getReviewsByProductId(productId);
      setReviews(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  if (loading) return <p className="text-center py-4">Loading reviews...</p>;
  if (!reviews.length) return <p className="text-gray-500 italic">No reviews yet.</p>;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="mt-6">
      
      <div className="space-y-4">
        {displayedReviews.map((review) => (
          <div key={review._id} className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <StarRating value={review.rating} />
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            {review.image && (
              <img
                src={review.image}
                alt="Review"
                className="w-32 h-32 mt-2 rounded border object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {showAll ? "View Less" : `View All Reviews (${reviews.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
