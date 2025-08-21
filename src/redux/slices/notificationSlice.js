// src/store/notifications/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// ✅ Get all notifications
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/notifications');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Get unread notifications
export const fetchUnreadNotifications = createAsyncThunk(
  'notifications/fetchUnreadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.get('/notifications/unread');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiClient.post(`/notifications/${id}/read`);
      return { id, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Mark all as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiClient.post('/notifications/read-all');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

// ✅ Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      return id; // return only id so we can filter it out from state
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const selectUnreadCount = state =>
  state.notifications.notifications.filter(n => !n.read_at).length;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unread: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // fetch all
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload?.data?.notifications || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch unread
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        state.unread = action.payload;
      })

      // mark one as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.notifications = state.notifications.map(n =>
    n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
  );
        state.unread = state.unread.filter(n => n.id !== id);
      })

      // mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, state => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unread = [];
      })

      // delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        state.unread = state.unread.filter(n => n.id !== action.payload);
      });
  },
});

export default notificationsSlice.reducer;
