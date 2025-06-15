import axios from 'axios';
import { urlConstants } from './index';
import { getConfig } from '../utils/getConfig';

export const getLearningPaths = async () => {
  try {
    const config = getConfig();
    const response = await axios.get(urlConstants.learningPaths, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching learning paths:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    throw error;
  }
};

export const getLearningPathById = async (id) => {
  try {
    const response = await axios.get(`${urlConstants.learningPaths}/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error(`Error fetching learning path with id ${id}:`, error);
    throw error;
  }
};
