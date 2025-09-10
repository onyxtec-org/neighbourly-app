// redux/slices/auth/resetPasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ id, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/reset-password-otp/${id}`, {
        password,
        password_confirmation,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetResetPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetResetPasswordState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
