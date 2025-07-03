import { api } from './api';

export const competitionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCompetitions: builder.query({
      query: () => 'competitions',
      providesTags: (result) =>
        result
          ? [
              ...result.competitions.map(({ _id }) => ({ type: 'Competition', id: _id })),
              { type: 'Competition', id: 'LIST' },
            ]
          : [{ type: 'Competition', id: 'LIST' }],
    }),
    getCompetitionById: builder.query({
      query: (id) => ({
        url: 'competitions/id',
        method: 'POST',
        body: { id },
      }),
      providesTags: (result, error, id) => [{ type: 'Competition', id }],
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
      query: ({ id, ...updates }) => ({
        url: 'competitions/update',
        method: 'POST',
        body: { id, ...updates },
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
  useGetCompetitionsQuery,
  useGetCompetitionByIdQuery,
  useCreateCompetitionMutation,
  useUpdateCompetitionMutation,
  useDeleteCompetitionMutation,
} = competitionApi; 