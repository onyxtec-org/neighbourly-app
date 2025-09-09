import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import apiClient from '../../../api/client';
// ✅ Base API URL

// ✅ Thunk for posting a review
export const postJobReview = createAsyncThunk(
  'reviews/postJobReview',
  async ({ jobId,body}, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/jobs/${jobId}/reviews`,body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

// ✅ Slice
const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postJobReview.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postJobReview.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(postJobReview.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;

export default reviewSlice.reducer;
