import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunk to fetch job details
export const fetchJobDetails = createAsyncThunk(
  'jobDetail/fetchJobDetails',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}`);
      if (response.data.success) {
        return response.data.data.job;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch job details');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice for job details
const jobDetailSlice = createSlice({
  name: 'jobDetail',
  initialState: {
    job: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearJobDetails: state => {
      state.job = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchJobDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.job = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobDetails } = jobDetailSlice.actions;

export default jobDetailSlice.reducer;