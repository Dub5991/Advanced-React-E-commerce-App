// Redux slice for managing the shopping cart

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find((item) => item.id === action.payload);
      if (existingItem) {
        existingItem.quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const existingItem = state.items.find((item) => item.id === action.payload);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      } else if (existingItem && existingItem.quantity === 1) {
        // Optionally remove the item if the quantity reaches 0
        state.items = state.items.filter((item) => item.id !== action.payload);
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;