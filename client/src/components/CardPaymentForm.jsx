import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/orderServices";
import { createPayment } from "../services/paymentServices";

const CardPaymentForm = ({ clientSecret, formData, cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Stripe is not ready yet");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.fullName,
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      toast.success("Payment successful!");

      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const customerId = user?._id;

        if (!cartItems.length) {
          toast.error("Cart is empty. Cannot place order.");
          return;
        }

        const products = cartItems.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        }));

        const totalAmount = cartItems.reduce(
          (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
          0
        );

        const vendorId = cartItems[0]?.productId?.vendor;

        if (!vendorId) {
          toast.error("Missing vendorId. Cannot place order.");
          return;
        }

        const orderData = {
          vendorId,
          products,
          totalAmount,
          paymentMethod: "card",
          shippingAddress: {
            street: formData.address,
            city: "",
            postalCode: "",
            country: "",
          },
        };

        console.log("📦 Sending card order:", orderData);

        const res = await createOrder(orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 201) {
          const orderId = res.data.order._id;

          console.log("Products for payment:", cartItems);

          for (const item of cartItems) {
            const vendorId = item.productId?.vendor;

            if (!vendorId) {
              console.error("Missing vendorId for:", item.productId?._id);
              toast.error("Missing vendorId. Cannot record payment.");
              continue;
            }

            console.log("💳 Creating payment for:", {
              productId: item.productId._id,
              vendorId,
            });

            await createPayment({
              paymentIntentId: result.paymentIntent.id,
              orderId,
              productId: item.productId._id,
              customerId,
              vendorId,
              amount: item.productId.price * item.quantity,
              paymentMethod: "Credit Card",
            });
          }

          toast.success("Payment recorded and order placed!");
          navigate("/orders");
        }
      } catch (err) {
        console.error("Error saving card order:", err);
        toast.error("Order creation failed after payment");
      }
    }
  };

  return (
    <form onSubmit={handleCardPayment} className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="space-y-2">
        <label className="block font-semibold text-gray-700">Card details</label>
        <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
                invalid: {
                  color: '#e53e3e',
                },
              },
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
      >
        Pay ₹{cartItems.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0).toFixed(2)}
      </button>
    </form>
  );
};

export default CardPaymentForm;



