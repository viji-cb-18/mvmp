import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data.orders || []));
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order._id}>
            Order ID: {order._id} | ₹{order.totalAmount} | Status: {order.orderStatus}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
