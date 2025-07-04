import { api } from './api';
import axios from 'axios';
import { getConfig } from '../utils/getConfig';

export const blogApi = api.injectEndpoints({
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // Blog Listing & Discovery
    getBlogs: builder.query({
      query: ({ page = 1, limit = 10, search = '', filter = '', tag = '' } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(filter && { filter }),
          ...(tag && { tag })
        });
        return `blogs?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Blog', id: _id })),
              { type: 'Blog', id: 'LIST' },
            ]
          : [{ type: 'Blog', id: 'LIST' }],
    }),
    getBlogById: builder.query({
      query: (id) => `blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => `blogs/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Blog', id: result?.data?._id }],
    }),
    getTrendingArticles: builder.query({
      query: ({ limit = 5 } = {}) => `blogs/trending?limit=${limit}`,
      providesTags: ['Blog'],
    }),
    getPopularTags: builder.query({
      query: ({ limit = 15 } = {}) => `blogs/popular-tags?limit=${limit}`,
    }),
    getCategories: builder.query({
      query: () => 'blogs/categories',
    }),

    // Blog Management (CRUD)
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: 'blogs',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),
    updateBlog: builder.mutation({
      query: (updates) => ({
        url: 'blogs/update',
        method: 'POST',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Blog', id }],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Blog', id: 'LIST' }],
    }),

    // Blog Interactions
    addComment: builder.mutation({
      query: ({ blogId, content }) => ({
        url: `blogs/${blogId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId }],
    }),
    toggleLike: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}/like`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, blogId) => [{ type: 'Blog', id: blogId }],
    }),
    toggleBookmark: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}/bookmark`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, blogId) => [{ type: 'Blog', id: blogId }],
    }),

    // User Blog Management
    getUserBlogs: builder.query({
      query: (userId) => `blogs/user/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'UserBlog', id: _id })),
              { type: 'UserBlog', id: 'LIST' },
            ]
          : [{ type: 'UserBlog', id: 'LIST' }],
    }),
    getDraftBlogs: builder.query({
      query: (userId) => `blogs/drafts/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'DraftBlog', id: _id })),
              { type: 'DraftBlog', id: 'LIST' },
            ]
          : [{ type: 'DraftBlog', id: 'LIST' }],
    }),
    getPublishedBlogs: builder.query({
      query: (userId) => `blogs/published/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'PublishedBlog', id: _id })),
              { type: 'PublishedBlog', id: 'LIST' },
            ]
          : [{ type: 'PublishedBlog', id: 'LIST' }],
    }),

    // Blog Analytics & Insights
    getBlogStats: builder.query({
      query: (blogId) => `blogs/${blogId}/stats`,
      providesTags: (result, error, blogId) => [{ type: 'BlogStats', id: blogId }],
    }),
    getBlogViews: builder.query({
      query: (blogId) => `blogs/${blogId}/views`,
      providesTags: (result, error, blogId) => [{ type: 'BlogViews', id: blogId }],
    }),
    incrementBlogView: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}/view`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, blogId) => [
        { type: 'BlogViews', id: blogId },
        { type: 'BlogStats', id: blogId }
      ],
    }),

    // Blog Search & Filtering
    searchBlogs: builder.query({
      query: ({ query, page = 1, limit = 10, filters = {} } = {}) => {
        const params = new URLSearchParams({
          q: query,
          page: page.toString(),
          limit: limit.toString(),
          ...filters
        });
        return `blogs/search?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'SearchBlog', id: _id })),
              { type: 'SearchBlog', id: 'LIST' },
            ]
          : [{ type: 'SearchBlog', id: 'LIST' }],
    }),
    getBlogsByTag: builder.query({
      query: ({ tag, page = 1, limit = 10 } = {}) => 
        `blogs/tag/${encodeURIComponent(tag)}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'TagBlog', id: _id })),
              { type: 'TagBlog', id: 'LIST' },
            ]
          : [{ type: 'TagBlog', id: 'LIST' }],
    }),
    getBlogsByCategory: builder.query({
      query: ({ category, page = 1, limit = 10 } = {}) => 
        `blogs/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'CategoryBlog', id: _id })),
              { type: 'CategoryBlog', id: 'LIST' },
            ]
          : [{ type: 'CategoryBlog', id: 'LIST' }],
    }),

    // Blog Recommendations
    getRecommendedBlogs: builder.query({
      query: ({ blogId, limit = 5 } = {}) => 
        `blogs/${blogId}/recommendations?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'RecommendedBlog', id: _id })),
              { type: 'RecommendedBlog', id: 'LIST' },
            ]
          : [{ type: 'RecommendedBlog', id: 'LIST' }],
    }),
    getRelatedBlogs: builder.query({
      query: ({ blogId, limit = 5 } = {}) => 
        `blogs/${blogId}/related?limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'RelatedBlog', id: _id })),
              { type: 'RelatedBlog', id: 'LIST' },
            ]
          : [{ type: 'RelatedBlog', id: 'LIST' }],
    }),

    // Blog Moderation (Admin/Author)
    moderateComment: builder.mutation({
      query: ({ blogId, commentId, action }) => ({
        url: `blogs/${blogId}/comments/${commentId}/moderate`,
        method: 'PUT',
        body: { action },
      }),
      invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId }],
    }),
    deleteComment: builder.mutation({
      query: ({ blogId, commentId }) => ({
        url: `blogs/${blogId}/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { blogId }) => [{ type: 'Blog', id: blogId }],
    }),
    reportBlog: builder.mutation({
      query: ({ blogId, reason }) => ({
        url: `blogs/${blogId}/report`,
        method: 'POST',
        body: { reason },
      }),
    }),

    // Image Management
    uploadBlogImage: builder.mutation({
      query: (formData) => ({
        url: 'blogs/image-upload',
        method: 'POST',
        body: formData,
        formData: true, // Important: Let RTK Query know this is form data
      }),
    }),
    deleteBlogImage: builder.mutation({
      query: (fileName) => ({
        url: `blogs/image/${fileName}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Utility function for image upload
export const uploadBlogImage = async (file, token, blogId) => {
  const formData = new FormData();
  formData.append('file', file);
  if (blogId) {
    formData.append('blogId', blogId);
  }

  const response = await axios.post('http://localhost:5000/api/blogs/image-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response.data;
};

// Utility function for image deletion
export const deleteBlogImage = async (fileName, token) => {
  const response = await axios.delete(`http://localhost:5000/api/blogs/image/${fileName}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return response.data;
};

// Export all hooks
export const {
  // Blog Listing & Discovery
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetTrendingArticlesQuery,
  useGetPopularTagsQuery,
  useGetCategoriesQuery,

  // Blog Management (CRUD)
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,

  // Blog Interactions
  useAddCommentMutation,
  useToggleLikeMutation,
  useToggleBookmarkMutation,

  // User Blog Management
  useGetUserBlogsQuery,
  useGetDraftBlogsQuery,
  useGetPublishedBlogsQuery,

  // Blog Analytics & Insights
  useGetBlogStatsQuery,
  useGetBlogViewsQuery,
  useIncrementBlogViewMutation,

  // Blog Search & Filtering
  useSearchBlogsQuery,
  useGetBlogsByTagQuery,
  useGetBlogsByCategoryQuery,

  // Blog Recommendations
  useGetRecommendedBlogsQuery,
  useGetRelatedBlogsQuery,

  // Blog Moderation (Admin/Author)
  useModerateCommentMutation,
  useDeleteCommentMutation,
  useReportBlogMutation,

  // Image Management
  useUploadBlogImageMutation,
  useDeleteBlogImageMutation,
} = blogApi;


