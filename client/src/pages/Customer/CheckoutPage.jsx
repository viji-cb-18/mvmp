import React, { useState, useEffect } from "react";
import { getCartItems } from "../../services/cartServices";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CardPaymentForm from "../../components/CardPaymentForm";
import { createPaymentIntent } from "../../services/paymentServices";
import axios from "../../services/axiosInstance";
import { createOrder } from "../../services/orderServices";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });

  const [formErrors, setFormErrors] = useState({});

  const [clientSecret, setClientSecret] = useState("");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );

  /*useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data.items || []);
      } catch (err) {
        toast.error("Failed to load cart");
      }
    };
    fetchCart();
  }, []);*/

  useEffect(() => {
    const fetchCartOrProduct = async () => {
      try {
        if (location.state?.product) {
          // 🛒 Single Product Buy Now
          console.log("Buy Now product detected:", location.state.product);
          const singleProduct = location.state.product;
          setCartItems([
            {
              productId: singleProduct,
              quantity: 1,
            },
          ]);
        } else {
          // 🛒 Normal Cart Checkout
          const res = await getCartItems();
          setCartItems(res.data.items || []);
        }
      } catch (err) {
        toast.error("Failed to load cart or product");
      }
    };
  
    fetchCartOrProduct();
  }, [location.state]);
  

  useEffect(() => {
    const initiatePayment = async () => {
      if (formData.paymentMethod === "card") {
        try {
          const res = await createPaymentIntent(Math.round(totalPrice * 100));
          setClientSecret(res.data.clientSecret);
        } catch (err) {
          toast.error("Failed to initiate Stripe payment");
        }
      }
    };

    initiatePayment();
  }, [formData.paymentMethod, totalPrice]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errors = {};
  
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }
  
    if (!formData.address.trim()) {
      errors.address = "Address is required.";
    }
  
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(formData.phone.trim())) {
      errors.phone = "Phone number must be 10–15 digits with no spaces or symbols.";
    }
    
  
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return { errors, valid: false };
    }
  
    setFormErrors(errors);
  
    return {
      errors,
      valid: Object.keys(errors).length === 0,
    };
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod === "cod") {
      await placeOrderWithoutStripe();
    } else {
      toast.info("Please complete card payment below.");
    }
  };

  const placeOrderWithoutStripe = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const customerId = user?._id;
  
      if (!cartItems.length) {
        toast.error("Your cart is empty");
        return;
      }
      const vendorId = cartItems[0]?.productId?.vendor || cartItems[0]?.productId?.vendor;
  
      if (!vendorId) {
        toast.error("Missing vendorId. Cannot place order.");
        return;
      }
  
      const products = cartItems.map((item) => ({
        productId: item.productId?._id,
        quantity: item.quantity,
        price: item.productId?.price,
      }));
  
      const orderData = {
        vendorId,
        products,
        totalAmount: totalPrice,
        paymentMethod: "cod",
        shippingAddress: {
          street: formData.address,
          city: "",
          postalCode: "",
          country: "",
        },
      };
  
      console.log("📦 Sending COD order:", orderData);
  
      const res = await createOrder(orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
  
      if (res.status === 201) {
        toast.success("COD Order Placed Successfully!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Error placing COD:", error.response?.data || error);
      toast.error(error.response?.data?.msg || "Failed to place COD order");
    }
  };
  

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        {formErrors.fullName && (
  <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
)}

        <textarea
          name="address"
          placeholder="Shipping Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
        {formErrors.address && (
  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
)}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />
{formErrors.phone && (
  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
)}
        <div className="mt-4">
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit/Debit Card</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700"
        >
          {formData.paymentMethod === "cod" ? "Place Order" : "Proceed to Pay"}
        </button>
      </form>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between">
              <div>
                <p className="font-medium">{item.productId?.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">
                ₹{(item.productId?.price || 0) * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t text-lg font-bold flex justify-between">
          <span>Total:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        {formData.paymentMethod === "card" && clientSecret && (
          <div className="mt-6">
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardPaymentForm
                clientSecret={clientSecret}
                formData={formData}
                cartItems={cartItems}
                totalPrice={totalPrice}
              />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
