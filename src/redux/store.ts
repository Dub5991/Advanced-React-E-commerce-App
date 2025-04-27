import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

// Configure the Redux store with the cart reducer
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Define types for the root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export the store
export default store;
