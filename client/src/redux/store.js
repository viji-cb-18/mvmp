import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import vendorReducer from './slices/vendorSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    vendors: vendorReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
