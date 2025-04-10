import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const response = await axios.get('/api/products');
          if (response.data && Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            console.error('Unexpected products data format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
      

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>

      <div className="bg-white shadow-md rounded-lg p-6">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left text-sm text-gray-600">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2">Product Name</th>
                  <th className="px-4 py-2">In Stock</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Price (₹)</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b border-gray-100">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.stock} units</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">₹{product.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.status === 'Published'
                            ? 'bg-green-100 text-green-700'
                            : product.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {product.status || 'Unpublished'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
