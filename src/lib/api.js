import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  // baseURL: "/api",
  baseURL: "https://next-e-commerce-iti.vercel.app/api",

});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  updateProfile: (data) => api.patch("/users/me", data),
  changePassword: (data) => api.patch("/users/me/change-password", data),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
};

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  add: (data) => api.post("/categories", data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productsAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  add: (data) => api.post("/products", data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get: () => api.get("/cart"),
  add: (productId, quantity) => api.post("/cart", { productId, quantity }),
  update: (productId, quantity) => api.patch(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete("/cart"),
};

export const ordersAPI = {
  place: (data) => api.post("/orders", data),
  getMyOrders: () => api.get("/orders/my-orders"),
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.patch(`/orders/${id}`, { action: "cancel" }),
  updateStatus: (id, orderStatus) => api.patch(`/orders/${id}`, { orderStatus }),
};

export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/products/${productId}/reviews`),
  add: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};

export default api;
