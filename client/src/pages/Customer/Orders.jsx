/*import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, returnOrder } from "../../services/orderServices";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaClock, FaCheck, FaTimesCircle, FaUndoAlt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      console.log("Orders response →", res.data);
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnOrder(id);
      toast.success("Return requested");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to request return");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const statusBadge = (status) => {
    const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "Pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><FaClock className="inline mr-1" /> Pending</span>;
      case "Processing":
        return <span className={`${base} bg-blue-100 text-blue-700`}><FaBoxOpen className="inline mr-1" /> Processing</span>;
      case "Delivered":
        return <span className={`${base} bg-green-100 text-green-700`}><FaCheck className="inline mr-1" /> Delivered</span>;
      case "Cancelled":
        return <span className={`${base} bg-red-100 text-red-700`}><FaTimesCircle className="inline mr-1" /> Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold text-gray-800">Order ID: <span className="text-blue-600">{order._id}</span></div>
                {statusBadge(order.orderStatus)}
              </div>
              <div className="text-gray-600 text-sm">Placed on: {new Date(order.createdAt).toLocaleString()}</div>
              <div className="text-gray-700 mt-2">Total: ₹{order.totalAmount}</div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Link
                  to={`/orders/${order._id}`}
                  className="text-blue-500 hover:underline font-medium"
                >
                  View Order Details
                </Link>

                <div className="flex gap-3 flex-wrap">
                  {order.orderStatus === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.orderStatus === "Delivered" && !order.returnRequested && (
                    <button
                      onClick={() => handleReturn(order._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      <FaUndoAlt className="inline mr-2" /> Request Return
                    </button>
                  )}

{order.products?.map((item, index) =>
  item.returnRequested && (
    <p key={index} className="text-sm text-gray-700 mt-1">
      {item.productId?.name}:{" "}
      {item.returnApproved === true ? (
        <span className="text-green-600 font-semibold">Return Approved</span>
      ) : item.returnApproved === false ? (
        <span className="text-red-600 font-semibold">Return Rejected</span>
      ) : (
        <span className="text-yellow-600 font-semibold">Return Requested (Pending)</span>
      )}
    </p>
  )
)}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

*/
import { useEffect, useState } from "react";
import { getMyOrders, cancelOrder, returnOrder } from "../../services/orderServices";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClock, FaCheck, FaTimesCircle, FaUndoAlt } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data?.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order canceled");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to cancel order");
    }
  };

  const handleRequestReturn = async (orderId) => {
    try {
      await returnOrder(orderId);
      toast.success("Return requested");
      fetchOrders();
    } catch (err) {
      toast.error("Failed to request return");
    }
  };

  const statusBadge = (status) => {
    const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "Pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}><FaClock className="inline mr-1" /> Pending</span>;
      case "Processing":
        return <span className={`${base} bg-blue-100 text-blue-700`}><FaBoxOpen className="inline mr-1" /> Processing</span>;
      case "Delivered":
        return <span className={`${base} bg-green-100 text-green-700`}><FaCheck className="inline mr-1" /> Delivered</span>;
      case "Cancelled":
        return <span className={`${base} bg-red-100 text-red-700`}><FaTimesCircle className="inline mr-1" /> Cancelled</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg shadow-sm p-6 bg-white hover:shadow-md transition">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold text-gray-800">
                  Order ID: <span className="text-blue-600">{order._id}</span>
                </div>
                {statusBadge(order.orderStatus)}
              </div>
              <div className="text-gray-600 text-sm">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="text-gray-700 mt-2">Total: ₹{order.totalAmount}</div>

              {order.products?.map((item, index) => {
                const status = item.returnApproved;
                if (status === true || status === false || item.returnRequested) {
                  return (
                    <p key={index} className="text-sm text-gray-700 mt-1">
                      {item.productId?.name}:{" "}
                      {status === true ? (
                        <span className="text-green-600 font-semibold">Return Approved</span>
                      ) : status === false ? (
                        <span className="text-red-600 font-semibold">Return Rejected</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Return Requested (Pending)</span>
                      )}
                    </p>
                  );
                }
                return null;
              })}

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Link
                  to={`/orders/${order._id}`}
                  className="text-blue-500 hover:underline font-medium"
                >
                  View Order Details
                </Link>

                <div className="flex gap-3 flex-wrap">
                  {order.orderStatus === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      Cancel Order
                    </button>
                  )}
                  {order.orderStatus === "Delivered" && (
                    <>
                      <button
                        onClick={() => handleRequestReturn(order._id)}
                        className="bg-[#00C896] hover:bg-[#00b286] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold transition"
                      >
                        <FaUndoAlt className="inline mr-2" /> Request Return
                      </button>
                      <button
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Track Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
