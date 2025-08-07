// redux/slices/categoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await apiClient.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { success, data } = response.data;
      if (success && data.categories) {
        return data.categories; // raw categories with children/services
      } else {
        return rejectWithValue('Failed to fetch categories');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
