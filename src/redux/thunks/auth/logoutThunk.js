import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
import storage from '../../../app/storage';

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();

      if (token) {
        await apiClient.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const tokenRemoved = await storage.removeToken();
      const userRemoved = await storage.removeUser();

      if (!tokenRemoved || !userRemoved) {
        throw new Error('Failed to clear local storage');
      }

      return 'Logout successful';
    } catch (error) {
      console.log('❌ Logout Error:', error?.response?.data || error.message);

      // Try to clean up anyway
      await storage.removeToken();
      await storage.removeUser();

      return rejectWithValue('Logout failed');
    }
  }
);