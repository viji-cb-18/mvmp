import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchVendorOrders = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setOrders(res.data.orders || []);
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  return (
    <div>
      <h2>Vendor Orders</h2>
      <ul>
        {orders.map((o) => (
          <li key={o._id}>
            {o.customerId?.name || 'Customer'} | Status: {o.orderStatus} | ₹{o.totalAmount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
