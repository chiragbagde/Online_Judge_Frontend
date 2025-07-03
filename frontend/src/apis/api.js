import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getConfig } from '../utils/getConfig';
import { baseUrl } from './index';
import { logout } from '../features/auth/authSlice';

// Define the core fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}api/`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const config = getConfig();
    for (const key in config.headers) {
      headers.set(key, config.headers[key]);
    }
    return headers;
  }
});

// Create the custom middleware wrapper
const baseQueryWithLogout = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If we receive a 401 Unauthorized, log the user out
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogout, // Use the custom wrapper
  tagTypes: ['Blog', 'User', 'Problem', 'Competition', 'Post'],
  endpoints: () => ({}),
}); 