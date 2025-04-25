/*import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getVendorOrders } from '../../services/orderServices';
import axios from '../../services/axiosInstance';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [shipmentData, setShipmentData] = useState({ trackingNumber: '', carrier: '' });

  const fetchVendorOrders = async () => {
    try {
      const res = await getVendorOrders();
      setOrders(res.data.orders || res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch vendor orders", error);
      toast.error("Could not load vendor orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchVendorOrders();
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status");
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShipmentData({ trackingNumber: '', carrier: '' });
    setModalVisible(true);
  };

  const handleCreateShipment = async () => {
    try {
      const payload = {
        orderId: selectedOrder._id,
        ...shipmentData,
      };
      await axios.post('/shipment', payload);
      toast.success("Shipment created successfully");
      setModalVisible(false);
      fetchVendorOrders();
    } catch (err) {
      console.error("Create shipment failed", err);
      toast.error("Failed to create shipment");
    }
  };

  useEffect(() => {
    if (user?._id) fetchVendorOrders();
  }, [user]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#2D70E4]">My Orders</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#3ED6B5]/10 text-[#065F46] uppercase tracking-wide font-semibold">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-green-50 transition">
                  <td className="p-3">{o.customerId?.name || 'Customer'}</td>
                  <td className="p-3 font-medium text-[#2D70E4]">
                    #{o._id.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="p-3 text-green-600 font-semibold">
                    ₹{o.totalAmount}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="px-2 py-1 rounded border text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenModal(o)}
                      className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
                    >
                      Create Shipment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Shipment</h3>
            <input
              type="text"
              placeholder="Tracking Number"
              value={shipmentData.trackingNumber}
              onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Carrier"
              value={shipmentData.carrier}
              onChange={(e) => setShipmentData({ ...shipmentData, carrier: e.target.value })}
              className="w-full mb-4 border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCreateShipment}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
*/
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getVendorOrders } from '../../services/orderServices';
import axios from '../../services/axiosInstance';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [shipmentData, setShipmentData] = useState({ trackingNumber: '', carrier: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchVendorOrders = async (page = 1) => {
    try {
      const res = await getVendorOrders({ page, limit });
      setOrders(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch vendor orders", error);
      toast.error("Could not load vendor orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      fetchVendorOrders(currentPage);
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status");
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setShipmentData({ trackingNumber: '', carrier: '' });
    setModalVisible(true);
  };

  const handleCreateShipment = async () => {
    try {
      const payload = {
        orderId: selectedOrder._id,
        ...shipmentData,
      };
      await axios.post('/shipment', payload);
      toast.success("Shipment created successfully");
      setModalVisible(false);
      fetchVendorOrders(currentPage);
    } catch (err) {
      console.error("Create shipment failed", err);
      toast.error("Failed to create shipment");
    }
  };

  useEffect(() => {
    if (user?._id) fetchVendorOrders(currentPage);
  }, [user, currentPage]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#2D70E4]">My Orders</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#3ED6B5]/10 text-[#065F46] uppercase tracking-wide font-semibold">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Order ID</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-green-50 transition">
                  <td className="p-3">{o.customerId?.name || 'Customer'}</td>
                  <td className="p-3 font-medium text-[#2D70E4]">
                    #{o._id.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="p-3 text-green-600 font-semibold">
                    ₹{o.totalAmount}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      className="px-2 py-1 rounded border text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleOpenModal(o)}
                      className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
                    >
                      Create Shipment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === index + 1 ? "bg-[#3ED6B5] text-white" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Shipment</h3>
            <input
              type="text"
              placeholder="Tracking Number"
              value={shipmentData.trackingNumber}
              onChange={(e) => setShipmentData({ ...shipmentData, trackingNumber: e.target.value })}
              className="w-full mb-3 border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Carrier"
              value={shipmentData.carrier}
              onChange={(e) => setShipmentData({ ...shipmentData, carrier: e.target.value })}
              className="w-full mb-4 border p-2 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleCreateShipment}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
