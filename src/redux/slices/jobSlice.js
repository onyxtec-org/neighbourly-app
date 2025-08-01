import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client'; // adjust path if needed

// Async thunk to create job
export const createJob = createAsyncThunk(
  'job/createJob',
  async ({ token, jobData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/jobs', jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
        console.log('Create Job Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetJobState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Error creating job';
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
