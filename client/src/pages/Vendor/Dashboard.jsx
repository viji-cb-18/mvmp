import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProductsByVendor } from "../../services/productServices";
import { getVendorOrders } from "../../services/orderServices";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await getProductsByVendor(user._id);
        setProducts(Array.isArray(productRes.data?.data) ? productRes.data.data : []);

        const orderRes = await getVendorOrders(user._id);
        const fetchedOrders = orderRes.data?.orders;
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchData();
  }, [user]);

  const recentProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const monthlySalesData = (() => {
    const salesMap = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const year = date.getFullYear();
      if (year !== parseInt(selectedYear)) return;
      const month = date.toLocaleString("default", { month: "short" });
      if (!salesMap[month]) salesMap[month] = 0;
      salesMap[month] += order.totalAmount;
    });
    return Object.entries(salesMap).map(([month, amount]) => ({ month, amount }));
  })();

  const categorySalesData = (() => {
    const map = {};
    orders.forEach((order) => {
      order.products?.forEach((item) => {
        const category = item.productId?.category?.name || "Other";
        if (!map[category]) map[category] = 0;
        map[category] += item.price * item.quantity;
      });
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  if (loading) {
    return <p className="text-center py-20 text-gray-500">Loading Dashboard...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Vendor Dashboard</h2>

     
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-green-100">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-green-100">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-5 text-center border border-green-100">
          <h3 className="text-sm text-gray-500">Total Sales</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-1">₹{totalSales.toFixed(2)}</p>
        </div>
      </div>

   
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₹${value}`} />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

   
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-800 px-6 py-4 border-b">Recent Products</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-800 uppercase tracking-wide font-semibold">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No recent products
                </td>
              </tr>
            ) : (
              recentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-emerald-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={product.images?.[0] || "/no-image.png"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">₹{product.price}</td>
                  <td className="px-4 py-3">
                    {product.stockQuantity <= 0 ? (
                      <span className="text-red-500 font-medium">Out of stock</span>
                    ) : product.stockQuantity < 5 ? (
                      <span className="text-yellow-600 font-semibold">
                        Low Stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">
                        In stock ({product.stockQuantity})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/vendor/editproduct/${product._id}`)}
                      className="text-sm text-emerald-700 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
