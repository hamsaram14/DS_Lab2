import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import restaurantReducer from './slices/restaurantSlice';
import orderReducer from './slices/orderSlice';

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  order: orderReducer,
});

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer, // Attach the combined reducers
});

export default store;
