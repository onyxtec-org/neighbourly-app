// src/store/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunk to report a profile
export const reportProfile = createAsyncThunk(
  'report/reportProfile',
  async ({ reported_id, reason, note }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/users/${reported_id}/report`, {
        reported_id,
        reason,
        note,
      });
console.log('Report Response:', response.data);
      return response.data; // backend response
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue(error.message);
    }
  }
);

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetReportState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(reportProfile.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(reportProfile.fulfilled, state => {
        state.loading = false;
        state.success = true;
      })
      .addCase(reportProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;
