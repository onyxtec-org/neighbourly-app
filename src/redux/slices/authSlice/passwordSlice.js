import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client'; // adjust path as needed
import authStorage from '../../../app/storage'; // where you get user data

// 🔁 Thunk
export const changePassword = createAsyncThunk(
    'password/changePassword',
    async ({ password, changed_password }, thunkAPI) => {
      try {
        const user = await authStorage.getUser();
        if (!user?.id) throw new Error('User not found');
  
        const response = await apiClient.put(`/change-password/${user.id}`, {
          password, // old password
          changed_password,
          changed_password_confirmation: changed_password,
        });
  
        if (response.status === 422) {
          return thunkAPI.rejectWithValue(response.data.message || 'Validation error');
        }
  
        return response.data;
      } catch (error) {
        const message =
          error?.response?.data?.message || error.message || 'Something went wrong';
        return thunkAPI.rejectWithValue(message);
      }
    }
  );
  
  
// 🧠 Slice
const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetPasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
