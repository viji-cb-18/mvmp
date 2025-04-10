import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => (
  <div className="product-card">
    <img src={product.images[0]} alt={product.name} style={{ width: '100%' }} />
    <h4>{product.name}</h4>
    <p>₹{product.price}</p>
    <Link to={`/product/${product._id}`}>View</Link>
  </div>
);

export default ProductCard;
