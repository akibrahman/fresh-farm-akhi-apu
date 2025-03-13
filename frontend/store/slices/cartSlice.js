import { createSlice } from "@reduxjs/toolkit";

const emptyCart = {
  cart: [],
  cartTotal: 0,
  discount: 0,
  totalPayableAmount: 0,
};

const initialState =
  typeof window !== "undefined"
    ? localStorage.getItem("elevateMart-cart")
      ? JSON.parse(localStorage.getItem("elevateMart-cart"))
      : emptyCart
    : emptyCart;

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((i) => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...item, quantity: 1, itemPrice: item.updatedPrice });
      }
      state.cartTotal += item.price;
      state.totalPayableAmount += item.updatedPrice;
      typeof window !== "undefined"
        ? localStorage.setItem("elevateMart-cart", JSON.stringify(state))
        : null;
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((i) => i._id === item._id);
      state.cart = state.cart.filter((i) => i._id != item._id);
      state.cartTotal -= item.price * item.quantity;
      state.totalPayableAmount -=
        existingItem.itemPrice * existingItem.quantity;
      typeof window !== "undefined"
        ? localStorage.setItem("elevateMart-cart", JSON.stringify(state))
        : null;
    },
    increaseQuantity: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((i) => i._id === item._id);
      existingItem.quantity += 1;
      state.cartTotal += existingItem.price;
      state.totalPayableAmount += existingItem.updatedPrice;
      typeof window !== "undefined"
        ? localStorage.setItem("elevateMart-cart", JSON.stringify(state))
        : null;
    },
    decreaseQuantity: (state, action) => {
      const item = action.payload;
      const existingItem = state.cart.find((i) => i._id === item._id);
      if (existingItem.quantity === 1) {
        return;
      }
      existingItem.quantity -= 1;
      state.cartTotal -= existingItem.price;
      state.totalPayableAmount -= existingItem.updatedPrice;
      typeof window !== "undefined"
        ? localStorage.setItem("elevateMart-cart", JSON.stringify(state))
        : null;
    },
    deleteCart: (state) => {
      state.cart = [];
      state.cartTotal = 0;
      state.discount = 0;
      state.totalPayableAmount = 0;
      typeof window !== "undefined"
        ? localStorage.removeItem("elevateMart-cart")
        : null;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCart,
} = cartSlice.actions;

export default cartSlice.reducer;
