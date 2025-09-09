import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
export const verifyForgotPasswordOtp = createAsyncThunk(
    'auth/verifyForgotPasswordOtp',
    async ({ email, otp }, { rejectWithValue }) => {
      try {
        const response = await apiClient.post('/verify-otp-forgot-password', {
          email,
          otp,
        });
  
        // 👇 Check if `response.data.success` is explicitly false
        if (response.data?.success === false) {
          return rejectWithValue(response.data?.message || 'OTP verification failed');
        }
  
        // ✅ Treat this as success
        return {
          user: response.data.data.user,
          message: response.data.message,
        };
      } catch (error) {
        return rejectWithValue('Network error or server not reachable');
      }
    }
  );
  

const verifyForgotOtpSlice = createSlice({
  name: 'verifyForgotOtp',
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
    message: '',
  },
  reducers: {
    resetVerifyForgotOtpState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.data = null;
      state.message = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(verifyForgotPasswordOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = {
          user: action.payload.user,  // <- user object
          message: action.payload.message, // <- success message
        };
        state.message = action.payload.message;
      })
      
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.message = '';
      });
  },
});

export const { resetVerifyForgotOtpState } = verifyForgotOtpSlice.actions;
export default verifyForgotOtpSlice.reducer;
