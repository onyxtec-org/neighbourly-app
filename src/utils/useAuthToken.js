// hooks/useAuthToken.js
import { useCallback } from 'react';
import storage from '../app/storage';

export const useAuthToken = () => {
  const getToken = useCallback(async () => {
    try {
      return await storage.getToken();
    } catch (error) {
      console.error('Failed to get token from hook:', error);
      return null;
    }
  }, []);

  const getUser = useCallback(async () => {
    try {
      return await storage.getUser();
    } catch (error) {
      console.error('Failed to get user from hook:', error);
      return null;
    }
  }, []);

  return { getToken, getUser };
};
