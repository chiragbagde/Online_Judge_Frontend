import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (userStr && token) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token,
        loading: false,
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    loading: false,
    token: "",
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      const { payload } = action;
      state.isAuthenticated = true;
      state.user = payload.user;
      state.token = payload.token;
      state.loading = false;
      
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('token', payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = "";
      state.loading = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
