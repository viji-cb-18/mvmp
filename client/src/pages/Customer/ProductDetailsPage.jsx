import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductById } from "../../services/productServices";
import { addToCart, getCartItems } from "../../services/cartServices";
import { setCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import ReviewList from "../../components/ReviewList";
import { FaCommentDots } from "react-icons/fa";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        console.log("Fetched Product ", res.data);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const res = await getCartItems();
      console.log("Cart items from server:", res.data);
      dispatch(setCart(res.data));
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      toast.error("Failed to add to cart");
    }
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (!product) return <p className="text-center py-10 text-red-500">Product not found</p>;

  const mainImage = Array.isArray(product.images) ? product.images[0] : null;
  const imageUrl = !mainImage || mainImage.includes("via.placeholder.com")
    ? "/no-image.png"
    : mainImage;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-auto max-h-[400px] object-contain border rounded p-4"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-blue-600 text-xl font-semibold mb-4">₹{product.price}</p>
          <p className="text-gray-700 mb-4">{product.description || "No description available."}</p>
          <p className="text-sm text-gray-500 mb-1">
            Category: {product.category?.name || "N/A"}
          </p>
          {product.subcategory?.name && (
            <p className="text-sm text-gray-500 mb-1">
              Subcategory: {product.subcategory.name}
            </p>
          )}
          {product.stockQuantity <= 0 ? (
  <p className="text-sm font-semibold text-red-600 mb-1">Out of Stock</p>
) : product.stockQuantity < 5 ? (
  <p className="text-sm font-semibold text-yellow-600 mb-1">
    Hurry! Only {product.stockQuantity} left in stock
  </p>
) : (
  <p className="text-sm font-semibold text-green-600 mb-1">In Stock</p>
)}

          <p className="text-sm text-gray-500 mb-1">
            Vendor: {product.vendorId?.storeName || "Vendor"}
          </p>

          <div className="flex gap-4 mt-4">
          <button
  disabled={product.stockQuantity <= 0}
  className={`${
    product.stockQuantity <= 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600"
  } text-white px-6 py-2 rounded font-semibold`}
  onClick={() => navigate("/checkout", { state: { product } })}
>
  Buy now
</button>

            <button
  disabled={product.stockQuantity <= 0}
  className={`${
    product.stockQuantity <= 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700"
  } text-white px-6 py-2 rounded font-semibold`}
  onClick={() => handleAddToCart(product._id)}
>
  Add to cart
</button>

            <button
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold flex items-center gap-2"
  onClick={() =>
    navigate("/enquiry", {
      state: {
        vendorId: product.vendorId?._id || product.vendorId,
        vendorName: product.vendorId?.storeName || "Vendor",
        productId: product._id,
        productName: product.name,
      },
    })
  }
>
  <FaCommentDots /> Ask Vendor
</button>

          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
        <ReviewList productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetails;

