// authSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { payload } = action;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.loading = false;
    },
    logout: (state, action) => {
      const { payload } = action;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;