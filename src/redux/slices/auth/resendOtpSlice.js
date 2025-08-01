// redux/slices/auth/resendOtpSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/resend-otp', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to resend OTP' });
    }
  }
);

const resendOtpSlice = createSlice({
  name: 'resendOtp',
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: '',
  },
  reducers: {
    resetResendOtpState: state => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(resendOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || 'OTP resent successfully';
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Failed to resend OTP' };
      });
  },
});

export const { resetResendOtpState } = resendOtpSlice.actions;
export default resendOtpSlice.reducer;
