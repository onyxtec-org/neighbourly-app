import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

// Async Thunk
export const fetchFeaturedServices = createAsyncThunk(
  'featuredServices/fetchFeaturedServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/services/featured');
      console.log('featured services', response.data);

      const { success, data } = response.data;
      if (success && data.services) {
        return data.services;
      } else {
        return rejectWithValue('Failed to fetch featured services');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const featuredServicesSlice = createSlice({
  name: 'featuredServices',
  initialState: {
    services: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFeaturedServices.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload;
      })
      .addCase(fetchFeaturedServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default featuredServicesSlice.reducer;
