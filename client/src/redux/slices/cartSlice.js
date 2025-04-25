import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalPrice: 0,
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      cartSlice.caseReducers.calculateTotal(state);
    },

    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item._id === product._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || '',
          quantity: 1,
        });
      }

      cartSlice.caseReducers.calculateTotal(state);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i._id !== action.payload);
        }
        cartSlice.caseReducers.calculateTotal(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
    },

    calculateTotal: (state) => {
      state.totalPrice = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  decreaseQuantity,
  clearCart,
  calculateTotal
} = cartSlice.actions;

export default cartSlice.reducer;

