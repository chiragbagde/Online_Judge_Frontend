import { api } from './api';

export const communityApi = api.injectEndpoints({
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // Posts Management
    getPosts: builder.query({
      query: ({ page = 1, filter = 'recent', limit = 10, userId = null } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          filter,
          ...(userId && { userId })
        });
        return `community/posts?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'Post', id: _id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostById: builder.query({
      query: (postId) => `community/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: 'community/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation({
      query: ({ postId, updates }) => ({
        url: `community/posts/${postId}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `community/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    // Post Interactions
    toggleLike: builder.mutation({
      query: (postId) => ({
        url: `community/posts/${postId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    addComment: builder.mutation({
      query: ({ postId, content }) => ({
        url: `community/posts/${postId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
    updateComment: builder.mutation({
      query: ({ postId, commentId, content }) => ({
        url: `community/posts/${postId}/comments/${commentId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `community/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),

    // User Relationships
    toggleFollow: builder.mutation({
      query: (userId) => ({
        url: 'community/follow',
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' },
        { type: 'Following', id: 'LIST' },
        { type: 'Followers', id: 'LIST' }
      ],
    }),
    getFollowingList: builder.query({
      query: (userId) => `community/following/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.following.map(({ _id }) => ({ type: 'Following', id: _id })),
              { type: 'Following', id: 'LIST' },
            ]
          : [{ type: 'Following', id: 'LIST' }],
    }),
    getFollowersList: builder.query({
      query: (userId) => `community/followers/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.followers.map(({ _id }) => ({ type: 'Followers', id: _id })),
              { type: 'Followers', id: 'LIST' },
            ]
          : [{ type: 'Followers', id: 'LIST' }],
    }),
    checkFollowStatus: builder.query({
      query: (userId) => `community/follow/status/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'FollowStatus', id: userId }],
    }),

    // User Posts & Activity
    getUserPosts: builder.query({
      query: ({ userId, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `community/posts/user/${userId}?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'UserPost', id: _id })),
              { type: 'UserPost', id: 'LIST' },
            ]
          : [{ type: 'UserPost', id: 'LIST' }],
    }),
    getFollowingPosts: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        return `community/posts/following?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'FollowingPost', id: _id })),
              { type: 'FollowingPost', id: 'LIST' },
            ]
          : [{ type: 'FollowingPost', id: 'LIST' }],
    }),

    // Community Discovery
    getTrendingPosts: builder.query({
      query: ({ limit = 10, timeframe = 'week' } = {}) => 
        `community/posts/trending?limit=${limit}&timeframe=${timeframe}`,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'TrendingPost', id: _id })),
              { type: 'TrendingPost', id: 'LIST' },
            ]
          : [{ type: 'TrendingPost', id: 'LIST' }],
    }),
    getPopularUsers: builder.query({
      query: ({ limit = 10 } = {}) => `community/users/popular?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'PopularUser', id: _id })),
              { type: 'PopularUser', id: 'LIST' },
            ]
          : [{ type: 'PopularUser', id: 'LIST' }],
    }),

    // Search & Filtering
    searchPosts: builder.query({
      query: ({ query, page = 1, limit = 10, filters = {} } = {}) => {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: limit.toString(),
          ...filters
        });
        return `community/posts/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'SearchPost', id: _id })),
              { type: 'SearchPost', id: 'LIST' },
            ]
          : [{ type: 'SearchPost', id: 'LIST' }],
    }),
    searchUsers: builder.query({
      query: ({ query, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: limit.toString(),
        });
        return `community/users/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: 'SearchUser', id: _id })),
              { type: 'SearchUser', id: 'LIST' },
            ]
          : [{ type: 'SearchUser', id: 'LIST' }],
    }),

    // User Profiles & Stats
    getUserProfile: builder.query({
      query: (userId) => `community/users/${userId}/profile`,
      providesTags: (result, error, userId) => [{ type: 'UserProfile', id: userId }],
    }),
    getUserStats: builder.query({
      query: (userId) => `community/users/${userId}/stats`,
      providesTags: (result, error, userId) => [{ type: 'UserStats', id: userId }],
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, updates }) => ({
        url: `community/users/${userId}/profile`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'UserProfile', id: userId },
        { type: 'UserStats', id: userId }
      ],
    }),

    // Community Moderation
    reportPost: builder.mutation({
      query: ({ postId, reason }) => ({
        url: `community/posts/${postId}/report`,
        method: 'POST',
        body: { reason },
      }),
    }),
    reportComment: builder.mutation({
      query: ({ postId, commentId, reason }) => ({
        url: `community/posts/${postId}/comments/${commentId}/report`,
        method: 'POST',
        body: { reason },
      }),
    }),
    reportUser: builder.mutation({
      query: ({ userId, reason }) => ({
        url: `community/users/${userId}/report`,
        method: 'POST',
        body: { reason },
      }),
    }),

    // Community Analytics
    getCommunityStats: builder.query({
      query: () => 'community/stats',
      providesTags: ['CommunityStats'],
    }),
    getPostAnalytics: builder.query({
      query: (postId) => `community/posts/${postId}/analytics`,
      providesTags: (result, error, postId) => [{ type: 'PostAnalytics', id: postId }],
    }),

    // Notifications
    getNotifications: builder.query({
      query: ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(unreadOnly && { unreadOnly: 'true' })
        });
        return `community/notifications?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.notifications.map(({ _id }) => ({ type: 'Notification', id: _id })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),
    markNotificationRead: builder.mutation({
      query: (notificationId) => ({
        url: `community/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: 'community/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

// Export all hooks
export const {
  // Posts Management
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,

  // Post Interactions
  useToggleLikeMutation,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,

  // User Relationships
  useToggleFollowMutation,
  useGetFollowingListQuery,
  useGetFollowersListQuery,
  useCheckFollowStatusQuery,

  // User Posts & Activity
  useGetUserPostsQuery,
  useGetFollowingPostsQuery,

  // Community Discovery
  useGetTrendingPostsQuery,
  useGetPopularUsersQuery,

  // Search & Filtering
  useSearchPostsQuery,
  useSearchUsersQuery,

  // User Profiles & Stats
  useGetUserProfileQuery,
  useGetUserStatsQuery,
  useUpdateUserProfileMutation,

  // Community Moderation
  useReportPostMutation,
  useReportCommentMutation,
  useReportUserMutation,

  // Community Analytics
  useGetCommunityStatsQuery,
  useGetPostAnalyticsQuery,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = communityApi; 