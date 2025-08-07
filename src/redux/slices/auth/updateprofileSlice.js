// src/redux/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { updateProfile } from '../thunks/profile/updateProfileThunk';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { setUser, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
