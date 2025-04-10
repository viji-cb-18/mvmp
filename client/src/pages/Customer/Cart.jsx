import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/cart/${JSON.parse(atob(token.split('.')[1])).userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCart(res.data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/cart/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchCart();
  };

  return cart ? (
    <div>
      <h2>Your Cart</h2>
      {cart.items.map(item => (
        <div key={item.productId._id}>
          {item.productId.name} - ₹{item.price} x {item.quantity}
          <button onClick={() => removeItem(item.productId._id)}>Remove</button>
        </div>
      ))}
      <h3>Total: ₹{cart.totalPrice}</h3>
    </div>
  ) : <p>Loading cart...</p>;
};

export default Cart;
