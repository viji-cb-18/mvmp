import React from "react";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        <img
          src={product.images?.[0] || "https://via.placeholder.com/150"}
          alt={product.name}
          className="w-full h-48 object-contain mb-4"
        />

        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-[#3ED6B5] font-bold text-lg mb-3">${product.price}</p>

        <p className="text-sm text-gray-600 mb-4">
          {product.description || "No description available."}
        </p>

        <div className="flex justify-between mt-4">
          <button className="bg-[#3ED6B5] hover:bg-[#31b9a1] text-white py-2 px-4 rounded">
            Add to Cart
          </button>
          <button
            onClick={() => window.location.href = `/product/${product._id}`}
            className="text-[#3ED6B5] hover:underline"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
