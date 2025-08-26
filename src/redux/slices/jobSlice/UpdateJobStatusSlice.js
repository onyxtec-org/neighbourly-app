import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client'; // adjust to where you store the token

// Async thunk for updating job status
export const updateJobStatus = createAsyncThunk(
  'jobs/updateJobStatus',
  async ({ jobId, status }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/jobs/${jobId}/status`,
        { status },
       
      );

      return response.data; // assuming API returns job data or success message
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

const updateJobStatusSlice = createSlice({
  name: 'updateJobStatus',
  initialState: {
    loading: false,
    success: false,
    error: null,
    updatedJob: null,
  },
  reducers: {
    resetUpdateStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.updatedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateJobStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateJobStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedJob = action.payload;
      })
      .addCase(updateJobStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateStatus } = updateJobStatusSlice.actions;

export default updateJobStatusSlice.reducer;
