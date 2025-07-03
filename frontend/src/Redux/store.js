// app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dataReducer from "../features/auth/dataSlice";
import { api } from '../apis/api';

const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
export default store;
