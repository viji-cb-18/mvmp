import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCartItems,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from "../../services/cartServices";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const discount = 60;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartItems();
        setCartItems(res.data.items || []);
      } catch (err) {
        console.error("Failed to load cart", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
  
    try {
      await updateCartQuantity(productId, newQty);
      const res = await getCartItems();
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };
  
  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      const res = await getCartItems();
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      const res = await getCartItems();
      setCartItems(res.data.items || []);
      toast.success("Cart cleared");
    } catch (err) {
      console.error("Failed to clear cart", err);
      toast.error("Failed to clear cart");
    }
  };
  
  

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.price || 0) * item.quantity,
    0
  );
  const finalTotal = totalPrice - discount;

  if (loading) return <p className="text-center py-10">Loading cart...</p>;

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
   
      <div className="lg:col-span-2 space-y-6">
      {cartItems.length > 0 && (
    <button
      onClick={handleClearCart}
      className="text-red-600 text-sm underline mb-2"
    >
      Clear Cart
    </button>
  )}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border p-4 rounded shadow-sm"
            >
              <div className="flex items-center gap-4">
              {console.log("Image URL:", item.productId?.images?.[0])}

              <img
  src={item.productId?.images?.[0] || "/no-image.png"}
  alt={item.productId?.name}
  className="w-20 h-20 object-contain border rounded"
/>

                <div>
                  <h3 className="font-medium">{item.productId?.name}</h3>
                  <p className="font-bold text-sm mt-1">
                    ₹{item.productId?.price.toFixed(2)}
                  </p>
                  <div className="text-sm mt-2">
                    <button className="text-blue-600 hover:underline mr-4">
                      Save for later
                    </button>
                    <button
  className="text-red-600 hover:underline"
  onClick={() => handleRemove(item.productId._id)}
>
  Remove
</button>
                  </div>
                </div>
              </div>
              <div className="flex items-center border rounded">
  <button
    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
    className="px-3 py-1 text-lg"
    disabled={item.quantity <= 1}
  >
    −
  </button>
  <span className="px-4">{item.quantity}</span>
  <button
    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
    className="px-3 py-1 text-lg"
  >
    +
  </button>
</div>
            </div>
          ))
        )}
      </div>

    
      <div className="bg-white border rounded shadow-sm p-6 space-y-6">
      
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>Total price:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <button
  onClick={() => navigate("/checkout")}
  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2 transition"
>Checkout</button>

        <div className="flex justify-center gap-4 mt-2">
          <img src="/icons/visa.svg" className="h-5" alt="Visa" />
          <img src="/icons/mastercard.svg" className="h-5" alt="Mastercard" />
          
        </div>
      </div>
    </div>
  );
};

export default CartPage;
