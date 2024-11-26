import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  restaurants: [],
  menu: [],
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRestaurantsSuccess: (state, action) => {
      state.loading = false;
      state.restaurants = action.payload;
    },
    fetchRestaurantsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMenuStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action) => {
      state.loading = false;
      state.menu = action.payload;
    },
    fetchMenuFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchRestaurantsStart,
  fetchRestaurantsSuccess,
  fetchRestaurantsFailure,
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
} = restaurantSlice.actions;


// Selectors
export const selectRestaurants = (state) => state.restaurant.restaurants;
export const selectMenu = (state) => state.restaurant.menu;
export const selectLoading = (state) => state.restaurant.loading;
export const selectError = (state) => state.restaurant.error;

export default restaurantSlice.reducer;

