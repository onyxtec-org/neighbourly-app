import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
import storage from '../../../app/storage';// ✅ adjust the path as per your project structure

export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/login', credentials);
      const { data, success } = response.data;

      if (success && data?.token && data?.user) {
        // ✅ Use your centralized storage methods
        await storage.storeToken(data.token);
        await storage.storeUser(data.user);
        console.log('user',data.user);
        
        return {
          user: data.user,
          token: data.token,
        };
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);
