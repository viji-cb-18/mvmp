import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CardPaymentForm";

const stripePromise = loadStripe("your_stripe_publishable_key"); 

export default function StripeWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
