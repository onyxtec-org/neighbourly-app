import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

// Async Thunk
export const fetchFeaturedCategories = createAsyncThunk(
  'featuredCategories/fetchFeaturedCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/categories/featured');
      console.log('featured categories', response.data);

      const { success, data } = response.data;
      if (success && data.categories) {
        return data.categories;
      } else {
        return rejectWithValue('Failed to fetch featured categories');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const featuredCategoriesSlice = createSlice({
  name: 'featuredCategories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFeaturedCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchFeaturedCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchFeaturedCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default featuredCategoriesSlice.reducer;
