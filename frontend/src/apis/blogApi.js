import axios from 'axios';
import { getConfig } from '../utils/getConfig';
import { urlConstants } from './index';

export const getBlogs = async ({page = 1, limit = 10, search = '', filter = ''}) => {
  try {
    const response = await axios.get(
      `${urlConstants.blogs}?page=${page}&limit=${limit}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await axios.get(`${urlConstants.blogsBySlug}/${slug}`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await axios.post(
      urlConstants.blogs,
      blogData,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (updates) => {
  try {
    const response = await axios.post(
      `${urlConstants.blogs}/id`,
      updates,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axios.delete(
      `${urlConstants.blogs}/${id}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const addComment = async (blogId, content) => {
  try {
    const response = await axios.post(
      `${urlConstants.blogs}/${blogId}/comments`,
      { content },
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const toggleLike = async (blogId) => {
  try {
    const response = await axios.put(
      `${urlConstants.blogs}/${blogId}/like`,
      {},
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const getTrendingArticles = async (limit = 5) => {
  try {
    const response = await axios.get(
      `${urlConstants.blogs}/trending`,
      { 
        params: {limit : 5},
        ...getConfig()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    throw error;
  }
};

// Get all categories with post counts
export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${urlConstants.blogs}/categories`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Get popular tags with their counts
export const getPopularTags = async ({limit = 15}) => {
  try {
    const response = await axios.get(
      `${urlConstants.blogs}/popular-tags`,
      { 
        params: { limit },
        ...getConfig()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching popular tags:', error);
    throw error;
  }
};
