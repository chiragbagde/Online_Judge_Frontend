import { api } from './api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Problems
    getAdminProblems: builder.query({
      query: (userId) => `problems/admin/${userId}`,
    }),
    getProblemIds: builder.query({
        query: (userId) => `problems/admin/ids/${userId}`,
    }),
    createProblem: builder.mutation({
      query: (newProblem) => ({
        url: 'problems/create',
        method: 'POST',
        body: newProblem,
      }),
      invalidatesTags: [{ type: 'Problem', id: 'LIST' }],
    }),
    updateProblem: builder.mutation({
      query: (updates) => ({
        url: 'problems/update',
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Problem', id }],
    }),
    deleteProblem: builder.mutation({
      query: (id) => ({
        url: `problems/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Problem', id: 'LIST' }],
    }),

    // Users
    getAdminUsers: builder.query({
      query: (userId) => `users/admin/${userId}`,
    }),
    createUser: builder.mutation({
        query: (newUser) => ({
            url: 'users/create',
            method: 'POST',
            body: newUser,
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
        query: (updates) => ({
            url: 'users/update',
            method: 'POST',
            body: updates,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
        query: (id) => ({
            url: `users/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Competitions
    getCompetitions: builder.query({
      query: () => 'competitions',
    }),
    createCompetition: builder.mutation({
      query: (newCompetition) => ({
        url: 'competitions/create',
        method: 'POST',
        body: newCompetition,
      }),
      invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
    updateCompetition: builder.mutation({
      query: (updates) => ({
        url: 'competitions/update',
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Competition', id }],
    }),
    deleteCompetition: builder.mutation({
      query: (id) => ({
        url: `competitions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
  }),
});

export const {
  // Problems
  useGetAdminProblemsQuery,
  useGetProblemIdsQuery,
  useCreateProblemMutation,
  useUpdateProblemMutation,
  useDeleteProblemMutation,
  // Users
  useGetAdminUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  // Competitions
  useGetCompetitionsQuery,
  useCreateCompetitionMutation,
  useUpdateCompetitionMutation,
  useDeleteCompetitionMutation,
} = adminApi; 