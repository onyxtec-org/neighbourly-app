// utils/getAuthToken.js
import storage from '../app/storage';

const getAuthToken = async () => {
  try {
    const token = await storage.getToken();
    return token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export default getAuthToken;
