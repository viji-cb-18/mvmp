import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(console.error);
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/cart/add', {
      productId: product._id,
      quantity: 1,
      price: product.price
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('Added to cart');
  };

  return product ? (
    <div>
      <img src={product.images[0]} alt={product.name} width="200" />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  ) : <p>Loading...</p>;
};

export default ProductDetails;
