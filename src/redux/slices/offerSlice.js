// src/redux/slices/offerSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../api/client';

// Async thunk to create offer
export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async (offerData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('offers', offerData); 
      console.log('resonse',response);
      
      return response.data;
    } catch (error) {
      console.error('Create Offer Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

export const offerStatusUpdate = createAsyncThunk(
    'offers/statusUpdate',
    async ({body,id}, { rejectWithValue }) => {

        
      try {
        const response = await apiClient.post(`/offers/${id}/status`, 
          body,
          
        );
  
       console.log('response for update offer status',response);
       
        if (response.status !== 200) {
          return rejectWithValue(response.data?.message || 'Offer updation failed');
        }
          return {
         data:response.data,
          message: response.data.message,
        };
      } catch (error) {
        return rejectWithValue('Network error or server not reachable');
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
      })
       .addCase(offerStatusUpdate.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(offerStatusUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.offer = action.payload;
      })
      .addCase(offerStatusUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create offer';
      });
  },
});

export const { resetOfferState } = offerSlice.actions;
export default offerSlice.reducer;
