import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice'; // Import the authSlice reducer

// Placeholder reducers (to be replaced later)
const restaurantReducer = (state = {}, action) => state;
const orderReducer = (state = {}, action) => state;

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer, // Use the authSlice reducer for auth
  restaurant: restaurantReducer,
  order: orderReducer,
});

// Configure the store (redux-thunk is included by default in @reduxjs/toolkit)
const store = configureStore({
  reducer: rootReducer,
});

export default store;
