import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

// ✅ Thunk: verify OTP
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/verify-otp', { email, otp });
      return response.data; // { success, message, data: { user, token } }
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'OTP verification failed' });
    }
  }
);

const verifyOtpSlice = createSlice({
  name: 'verifyOtp',
  initialState: {
    loading: false,
    success: false,
    error: null,
    message: '',
    data: null, // ✅ store user + token here
  },
  reducers: {
    resetVerifyOtpState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = '';
      state.data = null; // ✅ clear data on reset
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || 'OTP verified';
        state.data = action.payload?.data || null; // ✅ store user + token
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'OTP verification failed' };
        state.data = null;
      });
  },
});

export const { resetVerifyOtpState } = verifyOtpSlice.actions;
export default verifyOtpSlice.reducer;
