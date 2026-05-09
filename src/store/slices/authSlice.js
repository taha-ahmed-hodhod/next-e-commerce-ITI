import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const loadInitialState = () => {
  if (typeof window === "undefined") return { user: null, token: null };
  const token = Cookies.get("token");
  if (!token) return { user: null, token: null };
  const decoded = decodeToken(token);
  if (!decoded || decoded.exp * 1000 < Date.now()) {
    Cookies.remove("token");
    return { user: null, token: null };
  }
  return { user: decoded, token };
};

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    loginSuccess(state, action) {
      const token = action.payload;
      Cookies.set("token", token, { expires: 1 });
      state.token = token;
      state.user = decodeToken(token);
    },
    initAuth(state) {
      const loaded = loadInitialState();
      state.user = loaded.user;
      state.token = loaded.token;
    },
    logout(state) {
      Cookies.remove("token");
      state.token = null;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout, initAuth } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => !!state.auth.token;
export const selectRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
