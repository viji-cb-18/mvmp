import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders, cancelOrder } from "../../services/orderServices";
import {
  updateProfile,
  updateProfileImage,
  changePassword,
} from "../../services/authServices";
import { deleteUser } from "../../services/adminServices";
import { logout, setCredentials } from "../../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen, FaClock, FaCheck, FaTimesCircle, FaUndoAlt } from "react-icons/fa";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTrackOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };
  const handleRequestReturn = (orderId) => {
    navigate(`/orders/${orderId}?return=true`);
  };

  const { user } = useSelector((state) => state.auth);

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      country: ""
    },
    paymentMethod: ""
  });

  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const [imagePreview, setImagePreview] = useState(user?.profileImage || "");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          postalCode: user.address?.postalCode || "",
          country: user.address?.country || ""
        },
        paymentMethod: user.paymentMethod || ""
      });
    }
  }, [user]);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateProfile = async () => {
    const { name, email, phone, street, city, postalCode, country, paymentMethod } = form;

    if (!name || !email || !phone || !street || !city || !postalCode || !country || !paymentMethod) {
      return toast.error("Please fill out all required fields");
    }

    const payload = {
      name,
      email,
      phone,
      paymentMethod,
      address: {
        street,
        city,
        postalCode,
        country,
      },
    };

    try {
      const res = await updateProfile(payload);
      dispatch(setCredentials({
        token: localStorage.getItem("token"),
        user: res.data.user
      }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("profileImage", imageFile);

    try {
      const res = await updateProfileImage(formData);
      setImagePreview(res.data.profileImage);
      dispatch(setCredentials({
        token: localStorage.getItem("token"),
        user: { ...user, profileImage: res.data.profileImage },
      }));
      toast.success("Profile image updated");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteUser(user._id);
      toast.success("Account deleted");
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order canceled successfully");
      const res = await getMyOrders();
      setOrders(res.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel order");
    }
  };

  const openReviewModal = (orderId, productId) => {
    setSelectedOrderId(orderId);
    setSelectedProductId(productId);
    setShowReviewModal(true);
  };

  const openReturnModal = (orderId, productId) => {
    setReturnData({ orderId, productId });
    setShowReturnModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedOrderId(null);
    setSelectedProductId(null);
  };

  return (
    <div className="space-y-8">
  
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="flex justify-between items-start flex-col md:flex-row gap-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Welcome, {user?.name}
            </h2>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <p className="text-sm text-gray-600">
              Phone: {form.phone || "+91-XXXX-XXXXXX"}
            </p>
            <p className="text-sm text-gray-600">
                {form.address?.street}, {form.address?.city}, {form.address?.postalCode}, {form.address?.country}
             </p>

            <p className="text-sm text-gray-600">
              Payment: {form.paymentMethod || "No payment method saved"}
            </p>
          </div>

          <img
            src={imagePreview || "/no-image.png"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border"
          />
        </div>
      </div>

  

      <div id="profile" className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          Profile Setting
        </h3>
        <form
  onSubmit={(e) => {
    e.preventDefault();
    handleUpdateProfile();
  }}
  className="flex flex-col md:flex-row gap-6"
>
  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      placeholder="Full Name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="email"
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="text"
      placeholder="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="text"
      placeholder="Payment Method"
      value={form.paymentMethod}
      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
      className="border rounded p-2"
    />


    <input
      type="text"
      placeholder="Street Address"
      value={form.street}
      onChange={(e) => setForm({ ...form, street: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="text"
      placeholder="City"
      value={form.city}
      onChange={(e) => setForm({ ...form, city: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="text"
      placeholder="Postal Code"
      value={form.postalCode}
      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
      className="border rounded p-2"
    />
    <input
      type="text"
      placeholder="Country"
      value={form.country}
      onChange={(e) => setForm({ ...form, country: e.target.value })}
      className="border rounded p-2"
    />

    <button
      type="submit"
      className="mt-4 bg-[#00C896] hover:bg-[#00b286] text-white px-5 py-2 rounded text-sm font-medium col-span-2"
    >
      Save changes
    </button>
  </div>

  <div className="w-full md:w-48 flex flex-col items-center">
    <img
      src={imagePreview || "/no-image.png"}
      alt="Profile"
      className="w-32 h-32 rounded-full object-cover border mb-3"
    />
    <label className="mt-3">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          setImageFile(e.target.files[0]);
          setImagePreview(URL.createObjectURL(e.target.files[0]));
        }}
      />
      <span className="inline-block cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1 rounded text-xs">
        📤 Choose Image
      </span>
    </label>
    <button
      onClick={handleImageUpload}
      type="button"
      className="mt-2 bg-[#00C896] hover:bg-[#00b286] text-white px-4 py-1 rounded text-xs"
    >
      Upload
    </button>
  </div>
</form>


        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Password
            </h4>
            <p className="text-xs text-gray-500">
              Reset or change your password.
            </p>
            <button
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="mt-2 text-sm text-blue-600 hover:underline"
            >
              Change
            </button>

            {showPasswordFields && (
              <div className="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Old Password"
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="New Password (min 6 characters)"
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-3 py-2 border rounded text-sm"
                  value={passwords.confirmNewPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmNewPassword: e.target.value,
                    })
                  }
                />
                <button
                  onClick={async () => {
                    const { oldPassword, newPassword, confirmNewPassword } =
                      passwords;

                    if (!oldPassword || !newPassword || !confirmNewPassword) {
                      toast.error("All password fields are required");
                      return;
                    }

                    if (newPassword.length < 6) {
                      toast.error("New password must be at least 6 characters");
                      return;
                    }

                    if (newPassword !== confirmNewPassword) {
                      toast.error("Passwords do not match");
                      return;
                    }

                    try {
                      await changePassword(passwords);
                      toast.success("Password updated successfully");
                      setPasswords({
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                      });
                      setShowPasswordFields(false);
                    } catch (error) {
                      toast.error(
                        error.response?.data?.error ||
                          "Failed to update password"
                      );
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Update Password
                </button>
              </div>
            )}
          </div>

          <div className="p-4 border rounded">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Remove account
            </h4>
            <p className="text-xs text-gray-500">This action is permanent.</p>
            <button
              onClick={handleDeleteAccount}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>


<div id="orders" className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Orders</h3>
  {orders.length === 0 ? (
    <p className="text-gray-500">You haven't placed any orders yet.</p>
  ) : (
    <>
      <div className="space-y-6">
        {(showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
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
  <div className="my-2">
    {order.orderStatus === "Delivered" && (
                        <button
                          onClick={() => handleRequestReturn(order._id)}
                          className="bg-[#00C896] hover:bg-[#00b286] text-white px-4 py-2 rounded-lg shadow-sm text-sm font-semibold transition"
                        >
                          <FaUndoAlt className="inline mr-2" /> Request Return
                        </button>
                      )}
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Track Order
                      </button>
  </div>
)}

              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllOrders(!showAllOrders)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showAllOrders ? "Show Less" : "View All Orders"}
          </button>
        </div>
      )}
    </>
  )}
</div>


<div id="history" className="bg-white p-6 rounded-lg shadow-md">
  <h3 className="text-xl font-semibold text-gray-800 mb-6">Order History</h3>

  {orders.filter((o) => o.orderStatus === "Delivered").length === 0 ? (
    <p className="text-gray-500">No delivered orders yet.</p>
  ) : (
    <>
      <div className="space-y-6">
        {(showAllHistory
          ? orders.filter((o) => o.orderStatus === "Delivered")
          : orders.filter((o) => o.orderStatus === "Delivered").slice(0, 3)
        ).map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-5 bg-gray-50 shadow-sm flex flex-col md:flex-row justify-between gap-6"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Order ID: {order._id.slice(0, 6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ordered on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full text-white bg-green-500">
                  Delivered
                </span>
              </div>

              <div className="space-y-3">
                {order.orderItems?.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                      </p>
                    </div>
                    {item.productId && (
                      <button
                        onClick={() => openReviewModal(order._id, item.productId)}
                        className="text-sm text-purple-600 hover:underline ml-auto"
                      >
                        ✍️ Review
                      </button>
                    )}
                  </div>
                ))}

                {order.orderItems?.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{order.orderItems.length - 2} more items
                  </p>
                )}
              </div>

              {order.shipmentStatus && (
                <div className="text-xs text-blue-700 mt-2">
                  Shipment: {order.shipmentStatus}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end justify-between">
              <Link
                to={`/orders/${order._id}`}
                className="text-sm bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition"
              >
                View Order Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {orders.filter((o) => o.orderStatus === "Delivered").length > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showAllHistory ? "Show Less" : "View All Delivered Orders"}
          </button>
        </div>
      )}
    </>
  )}
</div>
      
    </div>
  );
};

export default Dashboard;



