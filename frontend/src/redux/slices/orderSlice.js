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

// Selectors
export const selectCart = (state) => state.order.cart;
export const selectOrderStatus = (state) => state.order.orderStatus;
export const selectOrderError = (state) => state.order.error;


export default orderSlice.reducer;
