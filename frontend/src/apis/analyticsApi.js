import { api } from './api';

export const analyticsApi = api.injectEndpoints({
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // User Analytics
    getUserAnalytics: builder.query({
      query: (userId) => `analytics/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'UserAnalytics', id: userId }],
    }),
    getUserStats: builder.query({
      query: (userId) => `analytics/user/${userId}/stats`,
      providesTags: (result, error, userId) => [{ type: 'UserStats', id: userId }],
    }),
    getUserSubmissions: builder.query({
      query: ({ userId, page = 1, limit = 20, filter = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(filter && { filter })
        });
        return `analytics/user/${userId}/submissions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ _id }) => ({ type: 'UserSubmission', id: _id })),
              { type: 'UserSubmission', id: 'LIST' },
            ]
          : [{ type: 'UserSubmission', id: 'LIST' }],
    }),
    getUserVerdictDistribution: builder.query({
      query: (userId) => `analytics/user/${userId}/verdicts`,
      providesTags: (result, error, userId) => [{ type: 'UserVerdicts', id: userId }],
    }),
    getUserCompetitions: builder.query({
      query: (userId) => `analytics/user/${userId}/competitions`,
      providesTags: (result, error, userId) => [{ type: 'UserCompetitions', id: userId }],
    }),
    getUserProgress: builder.query({
      query: ({ userId, timeframe = 'month' } = {}) => 
        `analytics/user/${userId}/progress?timeframe=${timeframe}`,
      providesTags: (result, error, userId) => [{ type: 'UserProgress', id: userId }],
    }),

    // Problem Analytics
    getProblemAnalytics: builder.query({
      query: (problemId) => `analytics/problem/${problemId}`,
      providesTags: (result, error, problemId) => [{ type: 'ProblemAnalytics', id: problemId }],
    }),
    getProblemStats: builder.query({
      query: (problemId) => `analytics/problem/${problemId}/stats`,
      providesTags: (result, error, problemId) => [{ type: 'ProblemStats', id: problemId }],
    }),
    getProblemSubmissions: builder.query({
      query: ({ problemId, page = 1, limit = 20, filter = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(filter && { filter })
        });
        return `analytics/problem/${problemId}/submissions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ _id }) => ({ type: 'ProblemSubmission', id: _id })),
              { type: 'ProblemSubmission', id: 'LIST' },
            ]
          : [{ type: 'ProblemSubmission', id: 'LIST' }],
    }),
    getProblemDifficulty: builder.query({
      query: (problemId) => `analytics/problem/${problemId}/difficulty`,
      providesTags: (result, error, problemId) => [{ type: 'ProblemDifficulty', id: problemId }],
    }),

    // Competition Analytics
    getCompetitionAnalytics: builder.query({
      query: (competitionId) => `analytics/competition/${competitionId}`,
      providesTags: (result, error, competitionId) => [{ type: 'CompetitionAnalytics', id: competitionId }],
    }),
    getCompetitionLeaderboard: builder.query({
      query: ({ competitionId, page = 1, limit = 50 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `analytics/competition/${competitionId}/leaderboard?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.leaderboard.map(({ _id }) => ({ type: 'CompetitionLeaderboard', id: _id })),
              { type: 'CompetitionLeaderboard', id: 'LIST' },
            ]
          : [{ type: 'CompetitionLeaderboard', id: 'LIST' }],
    }),
    getCompetitionStats: builder.query({
      query: (competitionId) => `analytics/competition/${competitionId}/stats`,
      providesTags: (result, error, competitionId) => [{ type: 'CompetitionStats', id: competitionId }],
    }),

    // Global Analytics
    getGlobalStats: builder.query({
      query: () => 'analytics/global/stats',
      providesTags: ['GlobalStats'],
    }),
    getGlobalLeaderboard: builder.query({
      query: ({ page = 1, limit = 50, timeframe = 'all' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          timeframe,
        });
        return `analytics/global/leaderboard?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.leaderboard.map(({ _id }) => ({ type: 'GlobalLeaderboard', id: _id })),
              { type: 'GlobalLeaderboard', id: 'LIST' },
            ]
          : [{ type: 'GlobalLeaderboard', id: 'LIST' }],
    }),
    getTopProblems: builder.query({
      query: ({ limit = 10, timeframe = 'month' } = {}) => 
        `analytics/global/top-problems?limit=${limit}&timeframe=${timeframe}`,
      providesTags: (result) =>
        result
          ? [
              ...result.problems.map(({ _id }) => ({ type: 'TopProblem', id: _id })),
              { type: 'TopProblem', id: 'LIST' },
            ]
          : [{ type: 'TopProblem', id: 'LIST' }],
    }),
    getTopUsers: builder.query({
      query: ({ limit = 10, timeframe = 'month' } = {}) => 
        `analytics/global/top-users?limit=${limit}&timeframe=${timeframe}`,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'TopUser', id: _id })),
              { type: 'TopUser', id: 'LIST' },
            ]
          : [{ type: 'TopUser', id: 'LIST' }],
    }),

    // Submission Analytics
    getSubmissionAnalytics: builder.query({
      query: ({ page = 1, limit = 20, filters = {} } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...filters
        });
        return `analytics/submissions?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.submissions.map(({ _id }) => ({ type: 'SubmissionAnalytics', id: _id })),
              { type: 'SubmissionAnalytics', id: 'LIST' },
            ]
          : [{ type: 'SubmissionAnalytics', id: 'LIST' }],
    }),
    getSubmissionStats: builder.query({
      query: ({ timeframe = 'month' } = {}) => `analytics/submissions/stats?timeframe=${timeframe}`,
      providesTags: ['SubmissionStats'],
    }),
    getVerdictDistribution: builder.query({
      query: ({ timeframe = 'month' } = {}) => `analytics/submissions/verdicts?timeframe=${timeframe}`,
      providesTags: ['VerdictDistribution'],
    }),

    // Language Analytics
    getLanguageStats: builder.query({
      query: ({ timeframe = 'month' } = {}) => `analytics/languages/stats?timeframe=${timeframe}`,
      providesTags: ['LanguageStats'],
    }),
    getLanguageTrends: builder.query({
      query: ({ timeframe = 'year' } = {}) => `analytics/languages/trends?timeframe=${timeframe}`,
      providesTags: ['LanguageTrends'],
    }),

    // Performance Analytics
    getPerformanceMetrics: builder.query({
      query: ({ userId, timeframe = 'month' } = {}) => 
        `analytics/performance/${userId}?timeframe=${timeframe}`,
      providesTags: (result, error, userId) => [{ type: 'PerformanceMetrics', id: userId }],
    }),
    getPerformanceComparison: builder.query({
      query: ({ userId, compareWith = 'average' } = {}) => 
        `analytics/performance/${userId}/compare?compareWith=${compareWith}`,
      providesTags: (result, error, userId) => [{ type: 'PerformanceComparison', id: userId }],
    }),

    // Social Analytics
    getUserSocialStats: builder.query({
      query: (userId) => `analytics/user/${userId}/social`,
      providesTags: (result, error, userId) => [{ type: 'UserSocialStats', id: userId }],
    }),
    getCommunityStats: builder.query({
      query: () => 'analytics/community/stats',
      providesTags: ['CommunityStats'],
    }),

    // Time-based Analytics
    getTimeSeriesData: builder.query({
      query: ({ type, timeframe = 'month', userId = null } = {}) => {
        const params = new URLSearchParams({
          type,
          timeframe,
          ...(userId && { userId })
        });
        return `analytics/timeseries?${params.toString()}`;
      },
      providesTags: (result) => ['TimeSeriesData'],
    }),
    getActivityHeatmap: builder.query({
      query: ({ userId, year = new Date().getFullYear() } = {}) => 
        `analytics/activity/heatmap/${userId}?year=${year}`,
      providesTags: (result, error, userId) => [{ type: 'ActivityHeatmap', id: userId }],
    }),

    // Achievement Analytics
    getUserAchievements: builder.query({
      query: (userId) => `analytics/user/${userId}/achievements`,
      providesTags: (result, error, userId) => [{ type: 'UserAchievements', id: userId }],
    }),
    getAchievementStats: builder.query({
      query: () => 'analytics/achievements/stats',
      providesTags: ['AchievementStats'],
    }),

    // Learning Path Analytics
    getUserLearningProgress: builder.query({
      query: (userId) => `analytics/user/${userId}/learning-progress`,
      providesTags: (result, error, userId) => [{ type: 'UserLearningProgress', id: userId }],
    }),
    getLearningPathStats: builder.query({
      query: (pathId) => `analytics/learning-path/${pathId}/stats`,
      providesTags: (result, error, pathId) => [{ type: 'LearningPathStats', id: pathId }],
    }),
  }),
});

// Export all hooks
export const {
  // User Analytics
  useGetUserAnalyticsQuery,
  useGetUserStatsQuery,
  useGetUserSubmissionsQuery,
  useGetUserVerdictDistributionQuery,
  useGetUserCompetitionsQuery,
  useGetUserProgressQuery,

  // Problem Analytics
  useGetProblemAnalyticsQuery,
  useGetProblemStatsQuery,
  useGetProblemSubmissionsQuery,
  useGetProblemDifficultyQuery,

  // Competition Analytics
  useGetCompetitionAnalyticsQuery,
  useGetCompetitionLeaderboardQuery,
  useGetCompetitionStatsQuery,

  // Global Analytics
  useGetGlobalStatsQuery,
  useGetGlobalLeaderboardQuery,
  useGetTopProblemsQuery,
  useGetTopUsersQuery,

  // Submission Analytics
  useGetSubmissionAnalyticsQuery,
  useGetSubmissionStatsQuery,
  useGetVerdictDistributionQuery,

  // Language Analytics
  useGetLanguageStatsQuery,
  useGetLanguageTrendsQuery,

  // Performance Analytics
  useGetPerformanceMetricsQuery,
  useGetPerformanceComparisonQuery,

  // Social Analytics
  useGetUserSocialStatsQuery,
  useGetCommunityStatsQuery,

  // Time-based Analytics
  useGetTimeSeriesDataQuery,
  useGetActivityHeatmapQuery,

  // Achievement Analytics
  useGetUserAchievementsQuery,
  useGetAchievementStatsQuery,

  // Learning Path Analytics
  useGetUserLearningProgressQuery,
  useGetLearningPathStatsQuery,
} = analyticsApi; 