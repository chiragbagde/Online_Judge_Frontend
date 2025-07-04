import { api } from './api';

export const competitionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Competition Overview & Management
    getCompetitions: builder.query({
      query: (userId) => `competitions?userId=${userId}`,
      providesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
    getCompetitionOverview: builder.mutation({
      query: (data) => ({
        url: 'competitions/overview',
        method: 'POST',
        body: data,
      }),
    }),
    getCompetitionById: builder.query({
      query: (id) => `competitions/${id}`,
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

    // User Registration & Participation
    registerUserForCompetition: builder.mutation({
      query: (data) => ({
        url: 'competitions/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
    addUserToCompetition: builder.mutation({
      query: (data) => ({
        url: 'competitions/registeruser',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
    getCompetitionTimestamp: builder.mutation({
      query: (data) => ({
        url: 'competitions/timestamp',
        method: 'POST',
        body: data,
      }),
    }),

    // Competition Problems
    getCompetition: builder.mutation({
      query: (data) => ({
        url: 'competitions/id',
        method: 'POST',
        body: data,
      }),
    }),
    getCompetitionProblem: builder.query({
      query: (data) => ({
        url: 'competitions/problem/id',
        method: 'POST',
        body: data,
      }),
      providesTags: (result, error, id) => [{ type: 'CompetitionProblem', id }],
    }),
    addProblemToCompetition: builder.mutation({
      query: (data) => ({
        url: 'competitions/problems/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { competitionId }) => [
        { type: 'CompetitionProblem', id: competitionId }
      ],
    }),
    removeProblemFromCompetition: builder.mutation({
      query: (data) => ({
        url: 'competitions/problems/remove',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { competitionId }) => [
        { type: 'CompetitionProblem', id: competitionId }
      ],
    }),

    // Submissions
    getUserSubmissions: builder.mutation({
      query: (params) => ({
        url: 'competitions/getusersubmisions',
        method: 'POST',
        body: params,
      }),
    }),
    getAllSubmissions: builder.mutation({
      query: (data) => ({
        url: 'competitions/getallsubmisions',
        method: 'POST',
        body: data,
      }),
    }),
    getSubmissionById: builder.query({
      query: (id) => `submissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Submission', id }],
    }),
    createSubmission: builder.mutation({
      query: (submission) => ({
        url: 'submissions/create',
        method: 'POST',
        body: submission,
      }),
      invalidatesTags: [
        { type: 'Submission', id: 'USER' },
        { type: 'Submission', id: 'ALL' },
        { type: 'Leaderboard', id: 'LIST' }
      ],
    }),
    updateSubmission: builder.mutation({
      query: (updates) => ({
        url: 'submissions/update',
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Submission', id },
        { type: 'Submission', id: 'USER' },
        { type: 'Submission', id: 'ALL' },
        { type: 'Leaderboard', id: 'LIST' }
      ],
    }),
    deleteSubmission: builder.mutation({
      query: (id) => ({
        url: `submissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Submission', id: 'USER' },
        { type: 'Submission', id: 'ALL' },
        { type: 'Leaderboard', id: 'LIST' }
      ],
    }),

    // Leaderboard
    getLeaderboard: builder.mutation({
      query: (data) => ({
        url: 'competitions/getleaderboard',
        method: 'POST',
        body: data,
      }),
    }),
    updateLeaderboard: builder.mutation({
      query: (data) => ({
        url: 'competitions/leaderboard/update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Leaderboard', id: 'LIST' }],
    }),

    // Competition Analytics
    getCompetitionStats: builder.query({
      query: (competitionId) => `competitions/${competitionId}/stats`,
      providesTags: [{ type: 'CompetitionStats', id: 'LIST' }],
    }),
    getParticipantStats: builder.query({
      query: (params) => ({
        url: 'competitions/participant-stats',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'ParticipantStats', id: 'LIST' }],
    }),
    getProblemStats: builder.query({
      query: (competitionId) => `competitions/${competitionId}/problem-stats`,
      providesTags: [{ type: 'ProblemStats', id: 'LIST' }],
    }),

    // Competition Status & Validation
    checkCompetitionStatus: builder.query({
      query: (id) => `competitions/${id}/status`,
      providesTags: (result, error, id) => [{ type: 'CompetitionStatus', id }],
    }),
    validateCompetitionAccess: builder.mutation({
      query: (data) => ({
        url: 'competitions/validate-access',
        method: 'POST',
        body: data,
      }),
    }),

    // Competition Settings & Configuration
    getCompetitionSettings: builder.query({
      query: (id) => `competitions/${id}/settings`,
      providesTags: (result, error, id) => [{ type: 'CompetitionSettings', id }],
    }),
    updateCompetitionSettings: builder.mutation({
      query: (data) => ({
        url: 'competitions/settings/update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'CompetitionSettings', id }],
    }),

    // Competition Notifications
    getCompetitionNotifications: builder.query({
      query: (competitionId) => `competitions/${competitionId}/notifications`,
      providesTags: [{ type: 'CompetitionNotification', id: 'LIST' }],
    }),
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'CompetitionNotification', id: 'LIST' }],
    }),

    // Competition Results & Certificates
    getCompetitionResults: builder.query({
      query: (competitionId) => `competitions/${competitionId}/results`,
      providesTags: [{ type: 'CompetitionResults', id: 'LIST' }],
    }),
    generateCertificate: builder.mutation({
      query: (data) => ({
        url: 'competitions/certificate/generate',
        method: 'POST',
        body: data,
      }),
    }),
    downloadCertificate: builder.query({
      query: (data) => ({
        url: 'competitions/certificate/download',
        method: 'POST',
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Competition Search & Discovery
    searchCompetitions: builder.query({
      query: (searchParams) => ({
        url: 'competitions/search',
        method: 'POST',
        body: searchParams,
      }),
      providesTags: [{ type: 'Competition', id: 'SEARCH' }],
    }),
    getUpcomingCompetitions: builder.query({
      query: (limit = 10) => `competitions/upcoming?limit=${limit}`,
      providesTags: [{ type: 'Competition', id: 'UPCOMING' }],
    }),
    getPastCompetitions: builder.query({
      query: (params) => ({
        url: 'competitions/past',
        method: 'POST',
        body: params,
      }),
      providesTags: [{ type: 'Competition', id: 'PAST' }],
    }),

    // Competition Templates
    getCompetitionTemplates: builder.query({
      query: () => 'competitions/templates',
      providesTags: [{ type: 'CompetitionTemplate', id: 'LIST' }],
    }),
    createCompetitionFromTemplate: builder.mutation({
      query: (data) => ({
        url: 'competitions/templates/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Competition', id: 'LIST' }],
    }),
  }),
});

export const {
  // Competition Overview & Management
  useGetCompetitionsQuery,
  useGetCompetitionOverviewMutation,
  useGetCompetitionByIdQuery,
  useCreateCompetitionMutation,
  useUpdateCompetitionMutation,
  useDeleteCompetitionMutation,

  // User Registration & Participation
  useRegisterUserForCompetitionMutation,
  useAddUserToCompetitionMutation,
  useGetCompetitionTimestampMutation,

  // Competition Problems
  useGetCompetitionMutation,
  useGetCompetitionProblemQuery,
  useAddProblemToCompetitionMutation,
  useRemoveProblemFromCompetitionMutation,

  // Submissions
  useGetUserSubmissionsMutation,
  useGetAllSubmissionsMutation,
  useGetSubmissionByIdQuery,
  useCreateSubmissionMutation,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,

  // Leaderboard
  useGetLeaderboardMutation,
  useUpdateLeaderboardMutation,

  // Competition Analytics
  useGetCompetitionStatsQuery,
  useGetParticipantStatsQuery,
  useGetProblemStatsQuery,

  // Competition Status & Validation
  useCheckCompetitionStatusQuery,
  useValidateCompetitionAccessMutation,

  // Competition Settings & Configuration
  useGetCompetitionSettingsQuery,
  useUpdateCompetitionSettingsMutation,

  // Competition Notifications
  useGetCompetitionNotificationsQuery,
  useMarkNotificationReadMutation,

  // Competition Results & Certificates
  useGetCompetitionResultsQuery,
  useGenerateCertificateMutation,
  useDownloadCertificateQuery,

  // Competition Search & Discovery
  useSearchCompetitionsQuery,
  useGetUpcomingCompetitionsQuery,
  useGetPastCompetitionsQuery,

  // Competition Templates
  useGetCompetitionTemplatesQuery,
  useCreateCompetitionFromTemplateMutation,
} = competitionApi; 