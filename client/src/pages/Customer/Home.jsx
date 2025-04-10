import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products')
      .then((res) => setProducts(res.data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>All Products</h2>
      <div className="product-list">
        {products.map(p => (
          <div key={p._id}>
            <img src={p.images[0]} alt={p.name} style={{ width: '150px' }} />
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <Link to={`/product/${p._id}`}>View</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
