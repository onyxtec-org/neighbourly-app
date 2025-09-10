// src/redux/slices/notificationSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('notifications'); // token is auto-injected
      return response.data;
    } catch (error) {
      console.error('Fetch Notifications Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

// Async thunk to mark a notification as read
export const setEmailNotifications = createAsyncThunk(
  'notifications/setEmailNotifications',
  async (body, { rejectWithValue }) => {
    console.log('body----',body);
    
    try {
      const response = await apiClient.post(`/user/config/update`,body);
      console.log('response',response);
      
      if (response.status !== 200) {
        return rejectWithValue(response.data?.message || 'Failed to set email notification');
      }
      return {
        data: response.data,
        message: response.data.message,
        id
      };
    } catch (error) {
      return rejectWithValue('Network error or server not reachable');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    loading: false,
    success: false,
    error: null,
    list: [],
  },
  reducers: {
    resetNotificationState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.list = [];
    },
  },
  extraReducers: builder => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch notifications';
      })

      // Mark notification as read
      .addCase(markNotificationRead.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = state.list.map(n =>
          n.id === action.payload.id ? { ...n, read: true } : n
        );
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to mark notification as read';
      });
  },
});

export const { resetNotificationState } = notificationSlice.actions;
export default notificationSlice.reducer;
