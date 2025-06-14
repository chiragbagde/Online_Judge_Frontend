import axios from 'axios';
import { urlConstants } from './index';
import { getConfig } from '../utils/getConfig';

export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(
      `${urlConstants.images}/upload`,
      formData,
      {
        ...getConfig(),
        headers: {
          ...getConfig().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    const response = await axios.delete(
      `${urlConstants.images}/delete`,
      {
        ...getConfig(),
        data: { imageUrl },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
