import { api } from './api';

export const problemsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProblems: builder.query({
      query: () => 'problems',
    }),
    getTopicCounts: builder.query({
      query: () => 'problems/topic-counts',
    }),
    getMyLists: builder.query({
      query: (userId) => `lists?user_id=${userId}`,
    }),
    createList: builder.mutation({
      query: (body) => ({
        url: 'lists/create',
        method: 'POST',
        body,
      }),
    }),
    updateList: builder.mutation({
      query: (body) => ({
        url: 'lists/update',
        method: 'POST',
        body,
      }),
    }),
    deleteList: builder.mutation({
      query: (body) => ({
        url: 'lists/delete',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetProblemsQuery,
  useGetTopicCountsQuery,
  useGetMyListsQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
} = problemsApi; 