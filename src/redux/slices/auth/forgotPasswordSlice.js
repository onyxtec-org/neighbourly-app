import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

// 🔁 Async thunk
export const sendForgotPasswordOtp = createAsyncThunk(
    'auth/sendForgotPasswordOtp',
    async (email, { rejectWithValue }) => {
      try {
        const response = await apiClient.post('/forgot-password-otp', { email });
  
        const responseData = response.data;
  
        // ✅ Treat it as success if success flag is true in response
        if (!responseData?.success) {
          return rejectWithValue(responseData?.message || 'Something went wrong');
        }
  
        return {
          email,
          message: responseData.message,
          userId: responseData.data?.user_id, // if you need it
        };
      } catch (error) {
        return rejectWithValue('Network error or server not reachable');
      }
    }
  );
  
const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState: {
    loading: false,
    error: null,
    success: false,
    email: null,
    message: null, // ✅ optional message if needed
  },
  reducers: {
    resetForgotPasswordState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.email = null;
      state.message = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(sendForgotPasswordOtp.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.email = null;
        state.message = null;
      })
      .addCase(sendForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.email = action.payload.email;
        state.message = action.payload.message || null;
        // state.userId = action.payload.userId; // if needed
      })
      
      .addCase(sendForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.email = null;
        state.message = null;
      });
  },
});

export const { resetForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
