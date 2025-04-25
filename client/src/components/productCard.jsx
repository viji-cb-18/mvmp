import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart, getCartItems } from "../services/cartServices";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const imageUrl = product.images?.[0] || "/no-image.png";

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      const res = await getCartItems();
      dispatch(setCart(res.data));
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={i < full ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border rounded-xl shadow-md p-4 relative flex flex-col justify-between min-h-[320px]">
    
      <Link to={`/product/${product._id}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-40 object-contain mx-auto mb-3"
        />
      </Link>

      <h3 className="text-base font-semibold text-gray-800 mb-1">
        {product.name}
      </h3>

      <div className="flex items-center text-sm mb-2">
        {renderStars(product.averageRating)}
        <span className="ml-2 text-gray-500 text-sm">
          ({product.numReviews || 0})
        </span>
      </div>

      <p className="text-emerald-500 font-bold text-lg">
        ₹{product.price}
      </p>

      <button
        onClick={handleAddToCart}
        className="absolute bottom-3 right-3 bg-emerald-400 hover:bg-emerald-500 text-white p-2 rounded-full shadow-md transition"
      >
        <FaShoppingCart />
      </button>
    </div>
  );
};

export default ProductCard;
