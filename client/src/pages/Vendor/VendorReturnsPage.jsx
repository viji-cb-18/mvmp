import React, { useEffect, useState } from "react";
import {
  getVendorOrders,
  approveReturnRequest,
  rejectReturnRequest
} from "../../services/orderServices";

import { toast } from "react-toastify";

const VendorReturnRequests = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProductId = (productId) =>
    typeof productId === "object" ? productId._id : productId;

  const fetchVendorOrders = async () => {
    try {
      const res = await getVendorOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch vendor orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const handleApprove = async (orderId, productId) => {
    try {
      await approveReturnRequest(orderId, productId);
      toast.success("Return approved and refund processed");
      //fetchVendorOrders();
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? {
                ...order,
                products: order.products.map(product =>
                  product.productId.toString() === productId.toString()
                    ? { ...product, returnApproved: true }
                    : product
                ),
              }
            : order
        )
      );
    } catch {
      toast.error("Failed to approve return");
    }
  };

  const handleReject = async (orderId, productId) => {
    try {
      await rejectReturnRequest(orderId, productId);
      toast.success("Return request rejected");
      //fetchVendorOrders();
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? {
                ...order,
                products: order.products.map(product =>
                  product.productId.toString() === productId.toString()
                    ? { ...product, returnApproved: false }
                    : product
                ),
              }
            : order
        )
      );
    } catch {
      toast.error("Failed to reject return");
    }
  };

  const returnRequests = orders.flatMap((order) =>
    order.products
      //.filter((item) => item.returnRequested)
      //.filter((item) => item.returnRequested !== false)
      
.filter((item) => item.returnRequested === true || item.returnApproved !== undefined)


      .map((item) => ({
        ...item,
        orderId: order._id,
        customer: order.customerId,
        orderedAt: order.createdAt,
      }))
  );

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!returnRequests.length)
    return <p className="p-6 text-center text-gray-600">No return requests found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#2D70E4]">Product Return Requests</h2>

      <div className="grid grid-cols-1 gap-6">
        {returnRequests.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow border border-gray-200 flex flex-col md:flex-row gap-6"
          >
          
            {item.productId?.images?.[0] ? (
              <img
                src={item.productId.images[0]}
                alt={item.productId.name}
                className="w-32 h-32 object-contain border rounded"
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center border rounded text-gray-400 text-sm">
                No Image
              </div>
            )}

         
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{item.productId?.name}</h3>
              <p className="text-sm text-gray-600 mb-1">Order ID: {item.orderId}</p>
              <p className="text-sm text-gray-600 mb-1">
                Customer: {item.customer?.name} ({item.customer?.email})
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Ordered At: {new Date(item.orderedAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Reason: {item.returnReason || "Not specified"}
              </p>

              {item.returnImage && (
  <img
    src={item.returnImage}
    alt="Return Proof"
    className="mt-2 w-32 h-32 object-cover border rounded"
  />
)}

          
<div className="mt-4 text-sm font-medium">
{item.returnApproved === true ? (
  <span className="px-3 py-1 rounded bg-green-100 text-green-800">Refunded</span>
) : item.returnApproved === false ? (
  <span className="px-3 py-1 rounded bg-red-100 text-red-800">Rejected</span>
) : (
  <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-800">Pending</span>
)}

</div>

{item.returnApproved === undefined && (

  <div className="mt-4 flex gap-2">
    <button
      //onClick={() => handleApprove(item.orderId, item.productId?._id)}
      onClick={() => handleApprove(item.orderId, getProductId(item.productId))}
      className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
    >
      Approve
    </button>
    <button
      //onClick={() => handleReject(item.orderId, item.productId?._id)}
      onClick={() => handleReject(item.orderId, getProductId(item.productId))}
      className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Reject
    </button>
  </div>
)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorReturnRequests;

