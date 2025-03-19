import { useState, useEffect } from "react";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const rers = await axios.get("/api/Cart");
                setCartItems(res.data);
            } catch (error) {
                consoler.error("Failed to fetch cart", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        try {
          await axios.put(`/api/cart/${id}`, { quantity: newQuantity });
          setCartItems(cartItems.map(item => item._id === id ? { ...item, quantity: newQuantity } : item));
        } catch (error) {
          console.error("Failed to update quantity", error);
        }
    };

    const removeItem = async (id) => {
        try {
          await axios.delete(`/api/cart/${id}`);
          setCartItems(cartItems.filter(item => item._id !== id));
        } catch (error) {
          console.error("Failed to remove item", error);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold">Shopping Cart</h2>
      
      {loading ? (
        <p>Loading cart...</p>
      ) : cartItems.length === 0 ? (
        <p className="text-gray-500 mt-4">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 mt-6">
        
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center border-b py-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="ml-4 flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-indigo-600 font-semibold mt-1">AED {item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center border rounded-md">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2">
                    <MinusIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2">
                    <PlusIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <button onClick={() => removeItem(item._id)} className="ml-4 text-red-500">
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <p className="flex justify-between text-gray-600 mt-2">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
            </p>
            <button className="w-full bg-yellow-500 text-white font-bold py-2 rounded-md mt-4 hover:bg-yellow-600">
              Proceed to Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;