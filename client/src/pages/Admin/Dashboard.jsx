import React, { useEffect, useState } from 'react';
import { getApprovedVendors } from '../../services/adminServices';
import { getAllOrders } from '../../services/orderServices';
import { FaUsers, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorRes = await getApprovedVendors();
        setVendors(vendorRes.data);
      } catch (err) {
        console.error('Failed to fetch vendors:', err);
      }

      try {
        const orderRes = await getAllOrders();
        setOrders(orderRes.data?.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.products?.some(product =>
      product.productId?.name?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  const orderChartData = vendors.map((vendor) => {
    const vendorOrders = orders.filter((order) => order.vendorId === vendor._id);
    return {
      name: vendor.storeName || 'Unnamed',
      orders: vendorOrders.length,
    };
  });

  const pieData = orderChartData.slice(0, 5);
  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-xl rounded-2xl">
      <h2 className="text-3xl font-bold text-[#2D70E4] mb-6">📊 Admin Dashboard</h2>

    
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#2D70E4] to-[#7AC3F1] text-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaUsers size={30} />
          <div>
            <p className="text-sm">Total Vendors</p>
            <h3 className="text-2xl font-bold">{vendors.length}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaShoppingCart size={30} />
          <div>
            <p className="text-sm">Total Orders</p>
            <h3 className="text-2xl font-bold">{orders.length}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <FaChartLine size={30} />
          <div>
            <p className="text-sm">Total Revenue</p>
            <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-[#2D70E4] mb-2">Orders by Vendor</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderChartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#2D70E4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/*<div className="bg-white border border-gray-200 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-[#2D70E4] mb-2">Top Vendors by Orders</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="orders"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>*/}
      </div>

     
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h3 className="text-lg font-semibold text-[#2D70E4]">Recent Orders</h3>
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3ED6B5] w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#2D70E4]/10 text-[#2D70E4] font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No recent orders.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-[#F0FDF4] transition">
                    <td className="px-4 py-3">
                      {order.products?.[0]?.productId?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      #{order.orderId || order._id?.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-blue-700 font-bold">
                      ₹{order.totalAmount || '0'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium
                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700'
                          : order.status === 'cancelled' ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status || 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
