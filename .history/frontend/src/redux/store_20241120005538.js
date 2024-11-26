import { configureStore } from '@reduxjs/toolkit';
//import thunk from 'redux-thunk';
//import { combineReducers } from 'redux';
import authReducer from './slices/authSlice'; // Import the authSlice reducer

// Placeholder reducers (will replace them later)
const restaurantReducer = (state = {}, action) => state;
const orderReducer = (state = {}, action) => state;

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer, // Use the authSlice reducer for auth
  restaurant: restaurantReducer,
  order: orderReducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;

