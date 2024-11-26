import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';

// Placeholder reducers (will replace them later)
const authReducer = (state = {}, action) => state;
const restaurantReducer = (state = {}, action) => state;
const orderReducer = (state = {}, action) => state;

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  restaurant: restaurantReducer,
  order: orderReducer,
});

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

export default store;
