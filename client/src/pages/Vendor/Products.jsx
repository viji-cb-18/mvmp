import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProductsByVendor, deleteProduct } from "../../services/productServices";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const Products = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await getProductsByVendor(user._id);
      console.log("Vendor Products:", res.data); 
      setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      toast.error("Failed to load products");
      console.error("Product fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted");
        fetchProducts(); 
      } catch (err) {
        toast.error("Failed to delete product");
        console.error("Delete error:", err);
      }
    }
  };

  useEffect(() => {
    if (user?._id) fetchProducts();
  }, [user]);

  const filtered = Array.isArray(products)
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-white min-h-screen rounded-xl shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#3ED6B5]"
          />
          <button
            onClick={() => navigate("/vendor/add-product")}
            className="bg-[#3ED6B5] text-white px-4 py-2 rounded-md hover:bg-[#2fb89c] text-sm"
          >
            ➕ Add Product
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#3ED6B5]/10 text-[#065F46] font-semibold uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr key={product._id} className="hover:bg-[#F0FDF4] transition">
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0] || "/no-image.png"}
                      alt={product.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 font-semibold">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stockQuantity > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {product.stockQuantity > 0
                        ? `In stock (${product.stockQuantity})`
                        : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 font-bold">
                    ₹{product.price}
                  </td>
                  <td className="px-4 py-3">{product.subcategory?.name || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => navigate(`/vendor/editproduct/${product._id}`)}
                        title="Edit"
                        className="text-[#3ED6B5] hover:text-[#2fb89c]"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
