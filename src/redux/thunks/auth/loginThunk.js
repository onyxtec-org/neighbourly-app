import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
import storage from '../../../app/storage';

// LOGIN USER
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async (credentials, { rejectWithValue, dispatch }) => {
    console.log('credentails',credentials);
    
    try {
      const response = await apiClient.post('/login', credentials);
      console.log('response----',response);
      
      const { data, success } = response.data;

      if (success && data?.token && data?.user) {
        // Store token & user
        await storage.storeToken(data.token);
        await storage.storeUser(data.user);

        // Send FCM token after login
        dispatch(sendFcm());

        return {
          user: data.user,
          token: data.token,
        };
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);

// SEND FCM TOKEN 
export const sendFcm = createAsyncThunk(
  'login/sendFcm',
  async (_, { rejectWithValue }) => {
    try {
      const fcmToken = await storage.geFcmToken() // ✅ Fetch from storage
      if (!fcmToken) {
        return rejectWithValue('No FCM token found in storage');
      }

      const response = await apiClient.post('/add/device/token', { token: fcmToken });
      const { status } = response.data;
       //console.log('fcm respons',response);
       
      if (status===200) {
        console.log('✅ FCM token sent successfully');
      } else {
        return rejectWithValue(response.data.message || 'FCM token sending failed');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong'
      );
    }
  }
);
