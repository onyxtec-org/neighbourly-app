// src/redux/slices/offerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunk to create offer
export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('offers', offerData); // token is auto-injected
      return response.data;
    } catch (error) {
      console.error('Create Offer Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

const offerSlice = createSlice({
  name: 'offers',
  initialState: {
    loading: false,
    success: false,
    error: null,
    offer: null,
  },
  reducers: {
    resetOfferState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.offer = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createOffer.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.offer = action.payload;
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create offer';
      });
  },
});

export const { resetOfferState } = offerSlice.actions;
export default offerSlice.reducer;
