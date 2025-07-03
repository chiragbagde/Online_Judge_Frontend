import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getConfig } from '../utils/getConfig';
import { baseUrl } from './index';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      // a bit of a hack to get the config headers
      const config = getConfig();
      for (const key in config.headers) {
        headers.set(key, config.headers[key]);
      }
      return headers;
    },
  }),
  tagTypes: ['Blog', 'User', 'Problem', 'Competition', 'Post'],
  endpoints: () => ({}),
}); 