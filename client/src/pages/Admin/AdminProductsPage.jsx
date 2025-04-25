/*import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct} from "../../services/productServices";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchProducts = async () => {
    try {
      const data = await getAllProducts(); 
      setProducts(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log("Trying to delete product ID:", id); 
  
        const response = await deleteProduct(id);
  
        console.log("Delete success response:", response); 
        toast.success("Product deleted");
  
        await fetchProducts();
      } catch (err) {
        console.error("Delete failed:", err?.response?.data || err.message); 
        toast.error(err?.response?.data?.error || "Failed to delete product");
      }
    }
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-[#2D70E4] mb-6">All Products</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full text-sm bg-white">
            <thead className="bg-[#2D70E4]/10 text-[#2D70E4] font-semibold uppercase tracking-wide">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Vendor</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-[#F0FDF4] transition">
                  <td className="py-3 px-4">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/100"}
                      alt={product.name}
                      className="w-14 h-14 rounded border object-cover"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                  <td className="py-3 px-4">{product.vendorId?.storeName || "N/A"}</td>
                  <td className="py-3 px-4">{product.category?.name || "N/A"}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                     {/*<Link
                        to={`/admin/products/edit/${product._id}`}
                        className="flex items-center gap-1 px-3 py-1 bg-[#3ED6B5] text-white rounded hover:bg-[#31b9a1] shadow-sm transition"
                      >
                        <FaEdit size={14} />
                        Edit
                      </Link>*//*
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
              ))}
            </tbody>
          </table>
          
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

*/
import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/productServices";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 

  const fetchProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const res = await getAllProducts({ page: pageNumber, limit: 5 });
      console.log("Products fetched:", res);
      setProducts(Array.isArray(res.data) ? res.data : []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch products", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log("Trying to delete product ID:", id); 
        await deleteProduct(id);
        toast.success("Product deleted");
        fetchProducts(page); 
      } catch (err) {
        console.error("Delete failed:", err?.response?.data || err.message); 
        toast.error(err?.response?.data?.error || "Failed to delete product");
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-[#2D70E4] mb-6">All Products</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full text-sm bg-white">
              <thead className="bg-[#2D70E4]/10 text-[#2D70E4] font-semibold uppercase tracking-wide">
                <tr>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Vendor</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-[#F0FDF4] transition">
                    <td className="py-3 px-4">
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/100"}
                        alt={product.name}
                        className="w-14 h-14 rounded border object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">₹{product.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{product.vendorId?.storeName || "N/A"}</td>
                    <td className="py-3 px-4">{product.category?.name || "N/A"}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        
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
                ))}
              </tbody>
            </table>
          </div>

         
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductsPage;
