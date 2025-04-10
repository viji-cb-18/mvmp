import React, { useEffect, useState } from "react";
import { getProductsByVendor } from "../../services/productServices";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadVendorProducts = async () => {
    try {
      const res = await getProductsByVendor(user._id);
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) loadVendorProducts();
  }, [user]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-1/2"
        />
        <button
          onClick={() => navigate("/vendor/add-product")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="border bg-white rounded shadow p-4 space-y-2"
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <p className="text-sm text-gray-500">
              Stock: {product.stockQuantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
