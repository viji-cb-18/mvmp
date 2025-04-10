import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/adminServices';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(res => setProducts(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Products</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>{p.name} - ₹{p.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProducts;
