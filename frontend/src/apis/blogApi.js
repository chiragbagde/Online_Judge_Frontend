import { api } from './api';
import axios from 'axios';
import { getConfig } from '../utils/getConfig';

export const blogApi = api.injectEndpoints({
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ page = 1, limit = 10, search = '', filter = '' } = {}) =>
        `blogs?page=${page}&limit=${limit}&search=${search}&filter=${filter}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Blog', id })),
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
        url: 'blogs/id',
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
    addComment: builder.mutation({
        query: ({blogId, content}) => ({
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
    getTrendingArticles: builder.query({
        query: ({ limit = 5 } = {}) => `blogs/trending?limit=${limit}`,
        providesTags: ['Blog'],
    }),
    getCategories: builder.query({
        query: () => 'blogs/categories',
    }),
    getPopularTags: builder.query({
        query: ({ limit = 15 } = {}) => `blogs/popular-tags?limit=${limit}`,
    }),
  }),
});

export const uploadBlogImage = async (file, token, blogId) => {
  const formData = new FormData();
  formData.append('file', file);
  if (blogId) {
      formData.append('blogId', blogId);
  }

  const response = await axios.post('http://localhost:5000/api/blogs/image-upload', formData, {
      headers: {
          'Content-Type': 'multipart/form-data',
      },
  });

  return response.data;
};

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddCommentMutation,
  useToggleLikeMutation,
  useGetTrendingArticlesQuery,
  useGetCategoriesQuery,
  useGetPopularTagsQuery,
} = blogApi;


