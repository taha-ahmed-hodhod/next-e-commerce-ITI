import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { cart: null, loading: false },
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearCartState(state) {
      state.cart = null;
    },
    optimisticUpdate(state, action) {
      const { productId, quantity } = action.payload;
      if (!state.cart) return;
      const item = state.cart.items.find(
        (i) => i.product?._id === productId || i.product === productId,
      );
      if (item) {
        if (quantity <= 0) {
          state.cart.items = state.cart.items.filter(
            (i) => i.product?._id !== productId && i.product !== productId,
          );
        } else {
          item.quantity = quantity;
        }
        state.cart.totalPrice = state.cart.items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0,
        );
      }
    },
    optimisticRemove(state, action) {
      const productId = action.payload;
      if (!state.cart) return;
      state.cart.items = state.cart.items.filter(
        (i) => i.product?._id !== productId && i.product !== productId,
      );
      state.cart.totalPrice = state.cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
  },
});

export const {
  setCart,
  setLoading,
  clearCartState,
  optimisticUpdate,
  optimisticRemove,
} = cartSlice.actions;
export const selectCart = (state) => state.cart.cart;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartItemCount = (state) =>
  state.cart.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
export const selectCartTotal = (state) => state.cart.cart?.totalPrice || 0;

export default cartSlice.reducer;
