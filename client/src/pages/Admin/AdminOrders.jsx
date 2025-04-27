import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderServices";
import { toast } from "react-toastify";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const res = await getAllOrders(statusFilter);
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) =>
    o.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.vendorId?.storeName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Orders</h2>

        
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-800 uppercase font-semibold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vendor</th>
                <th className="p-3">Total</th>
                
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredOrders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 font-semibold text-blue-700">
                    #{o._id.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="p-3">{o.customerId?.name || "N/A"}</td>
                  <td className="p-3">{o.vendorId?.storeName || "N/A"}</td>
                  <td className="p-3">₹{o.totalAmount}</td>
                 
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        o.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : o.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
