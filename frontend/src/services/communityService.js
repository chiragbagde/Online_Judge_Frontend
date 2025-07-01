import axios from 'axios';
import { getConfig } from '../utils/getConfig';
import { urlConstants } from '../apis';

// Get posts with pagination
export const getPosts = async (page = 1, filter = 'recent') => {
  try {
    const response = await axios.get(
      `${urlConstants.getCommunityPosts}?page=${page}&filter=${filter}`,
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error.response?.data || { message: 'Failed to fetch posts' };
  }
};

// Create a new post
export const createPost = async (content, id) => {
  try {
    const response = await axios.post(`${urlConstants.createCommunityPost}`, 
      { content, id },
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create post' };
  }
};

// Like/Unlike a post
export const toggleLike = async (postId) => {
  try {
    const response = await axios.post(
      `${urlConstants.likeCommunityPost}/${postId}/like`,
      {},
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to like/unlike post' };
  }
};

// Add a comment to a post
export const addComment = async (postId, text) => {
  try {
    const response = await axios.post(
      `${urlConstants.commentCommunityPost}/${postId}/comments`,
      { text },
      getConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add comment' };
  }
};

export const toggleFollow = async (userId) => {
  const response = await fetch(`${urlConstants.followCommunityPost}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update follow status');
  }
  
  return response.json();
};

export const getFollowingList = async () => {
  const response = await fetch(`${urlConstants.getFollowingList}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch following list');
  }
  
  return response.json();
};

export const getFollowersList = async () => {
  const response = await fetch(`${urlConstants.getFollowersList}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch followers list');
  }
  
  return response.json();
}; 

export const checkFollowStatus = async (userId) => {
  const response = await fetch(`${urlConstants.followCommunityPost}/status/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to check follow status');
  }
  return response.json();
};