import { createSlice } from "@reduxjs/toolkit";

// ===================== PRODUCTS =====================
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    total: 0,
    currentProduct: null,
    loading: false,
    filters: {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
      page: 1,
    },
  },
  reducers: {
    setProducts(state, action) {
      state.items = action.payload.products;
      state.total = action.payload.total;
    },
    setCurrentProduct(state, action) {
      state.currentProduct = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage(state, action) {
      state.filters.page = action.payload;
    },
    removeProduct(state, action) {
      state.items = state.items.filter((p) => p._id !== action.payload);
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
  },
});

export const {
  setProducts,
  setCurrentProduct,
  setLoading: setProductsLoading,
  setFilters,
  setPage,
  removeProduct,
  clearCurrentProduct,
} = productsSlice.actions;
export const selectProducts = (state) => state.products.items;
export const selectProductsTotal = (state) => state.products.total;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectFilters = (state) => state.products.filters;

// ===================== ORDERS =====================
const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false },
  reducers: {
    setOrders(state, action) {
      state.items = action.payload;
    },
    setOrdersLoading(state, action) {
      state.loading = action.payload;
    },
    addOrder(state, action) {
      state.items.unshift(action.payload);
    },
    updateOrder(state, action) {
      const idx = state.items.findIndex((o) => o._id === action.payload._id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    cancelOrderState(state, action) {
      const order = state.items.find((o) => o._id === action.payload);
      if (order) order.orderStatus = "cancelled";
    },
  },
});

export const {
  setOrders,
  setOrdersLoading,
  addOrder,
  updateOrder,
  cancelOrderState,
} = ordersSlice.actions;
export const selectOrders = (state) => state.orders.items;
export const selectOrdersLoading = (state) => state.orders.loading;

export const productsReducer = productsSlice.reducer;
export const ordersReducer = ordersSlice.reducer;
