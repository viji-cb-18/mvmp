import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/vendors/performance-report', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVendors(res.data);
      } catch (err) {
        console.error('Error fetching performance:', err);
      }

      try {
        const orderRes = await axios.get('/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalOrders(orderRes.data.totalItems);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Vendors: {vendors.length}</p>
      <p>Total Orders: {totalOrders}</p>
    </div>
  );
};

export default Dashboard;
