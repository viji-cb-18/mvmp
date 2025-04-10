import React from 'react';
import axios from 'axios';

const Checkout = () => {
  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    const res = await axios.get(`/api/cart/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const cart = res.data;
    const products = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price
    }));

    const vendorId = products[0]?.productId?.vendorId; // Simplified

    await axios.post('/api/orders/create', {
      customerId: userId,
      vendorId,
      products,
      totalAmount: cart.totalPrice
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Order placed!');
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default Checkout;
