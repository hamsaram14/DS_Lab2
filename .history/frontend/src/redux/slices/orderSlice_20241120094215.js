import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  orderStatus: null,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.cart = [];
    },
    updateOrderStatus: (state, action) => {
      state.orderStatus = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateOrderStatus,
  setOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
