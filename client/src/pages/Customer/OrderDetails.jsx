import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../services/orderServices";
import { toast } from "react-toastify";
import ReviewForm from "../../components/ReviewForm";
import ReturnRequestModal from "../../components/ReturnRequestModal";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReturnModal, setShowReturnModal] = useState({ show: false, productId: null });

  const fetchOrder = async () => {
    try {
      const res = await getOrderById(orderId);
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  const orderSteps = ["Order Placed", "Processing", "Shipped", "Delivered"];
  const getStepIndex = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Processing":
        return 1;
      case "Shipped":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(order?.orderStatus);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!order) return <p className="p-6 text-center text-red-500">Order not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Order #{order._id}</h2>

      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Track Order</h3>
        <div className="flex items-center justify-between">
          {orderSteps.map((step, index) => (
            <div key={index} className="flex-1 text-center relative">
              <div
                className={`w-4 h-4 mx-auto rounded-full ${
                  index <= currentStep ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
              <p className={`text-sm mt-1 ${index <= currentStep ? "text-green-700" : "text-gray-500"}`}>
                {step}
              </p>
              {index < orderSteps.length - 1 && (
                <div
                  className={`absolute top-2 left-1/2 w-full h-0.5 ${
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p><strong>Status:</strong> {order.orderStatus}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <div>
          <p className="font-semibold">Shipping Address:</p>
          {order.shippingAddress ? (
            <>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </>
          ) : (
            <p className="text-gray-500">No shipping address found</p>
          )}
        </div>
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Ordered Products</h3>
      <div className="space-y-6">
        {order.products.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row bg-gray-50 p-4 rounded shadow gap-6">
            <div className="w-full sm:w-40 h-40 bg-white border rounded flex items-center justify-center">
              <img
                src={item.productId?.images?.[0] || "/placeholder.png"}
                alt={item.productId?.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="flex-1">
              <p className="text-lg font-semibold">{item.productId?.name}</p>
              <p className="text-gray-700">₹{item.price} x {item.quantity}</p>
              <p className="text-sm text-gray-500 mt-1">
                Subtotal: ₹{item.price * item.quantity}
              </p>

              {order.orderStatus === "Delivered" && (
                <div className="mt-4">
                  <ReviewForm productId={item.productId?._id} />
                </div>
              )}

              {item.returnRequested ? (
                <p className="text-sm mt-2">
                  Return Status:{" "}
                  <span className={`font-medium ${item.returnStatus === 'Refunded' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {item.returnStatus || 'Pending'}
                  </span>
                </p>
              ) : (
                order.orderStatus === "Delivered" && (
                  <button
                    onClick={() => setShowReturnModal({ show: true, productId: item.productId?._id })}
                    className="mt-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 text-xs rounded"
                  >
                    Request Return
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/shop")}
          className="bg-[#A1E9D1] hover:bg-[#81dcc1] text-black px-6 py-2 rounded text-sm font-medium"
        >
          Back to Shop
        </button>
      </div>

     
      {showReturnModal.show && (
        <ReturnRequestModal
          orderId={order._id}
          productId={showReturnModal.productId}
          onClose={() => setShowReturnModal({ show: false, productId: null })}
          onSuccess={fetchOrder}
        />
      )}
    </div>
  );
};

export default OrderDetails;
