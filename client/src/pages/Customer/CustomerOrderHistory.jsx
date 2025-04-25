import React, { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orderServices";

const CustomerOrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        const history = res.data?.data?.filter(order => order.orderStatus === "Cancelled" || order.orderStatus === "Delivered") || [];
        setOrders(history);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No past orders found.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="border p-4 rounded shadow">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Status:</strong> {order.orderStatus}</div>
              <div><strong>Total:</strong> ₹{order.totalAmount}</div>
              <div><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomerOrderHistory;