import axios from './axiosInstance';

export const addToCart = (productId, quantity = 1) => {
    return axios.post("/cart/add", { productId, quantity });
  };
  
  
  export const getCartItems = () => {
    return axios.get("/cart");
  };
  
  
  export const removeFromCart = (productId) => {
    return axios.delete(`/cart/remove/${productId}`);
  };
  
  export const updateCartQuantity = (productId, quantity) => {
    return axios.put("/cart/update", { productId, quantity });
  };
  
  export const clearCart = () => {
    return axios.delete("/cart/clear");
  };