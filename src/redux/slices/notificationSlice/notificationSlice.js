// src/store/notifications/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

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
  }
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
  }
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
  }
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
  }
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
  }
);

// ✅ Selector for unread count
export const selectUnreadCount = (state) => state.notifications.unreadCount;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    // ✅ When a new notification comes from push
    incrementUnreadCount: (state, action) => {
      state.unreadCount += 1;
      console.log('unread count in slice',state.unreadCount);
      
    },
    // ✅ Reset unread count manually if needed
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch all notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const notifications = action.payload?.data?.notifications || [];
        state.notifications = notifications;
        // ✅ Calculate unread count
        state.unreadCount = notifications.filter((n) => n.read_at === null).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Fetch unread notifications
      .addCase(fetchUnreadNotifications.fulfilled, (state, action) => {
        const unread = action.payload?.data?.notifications || [];
        state.unreadCount = unread.length;
      })

      // ✅ Mark one as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        );
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      })

      // ✅ Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read_at: new Date().toISOString(),
        }));
        state.unreadCount = 0;
      })

      // ✅ Delete a notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        state.unreadCount = state.notifications.filter((n) => n.read_at === null).length;
      });
  }
});

export const { incrementUnreadCount, resetUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
