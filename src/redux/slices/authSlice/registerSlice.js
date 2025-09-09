import { createSlice } from '@reduxjs/toolkit';
import { registerUser } from '../../thunks/auth/registerThunks';

const initialState = {
  loading: false,
  success: false,
  message: '',
  error: null,
  user: null,
  token: null,
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: { 
    resetRegisterState: state => {
      state.loading = false;
      state.success = false;
      state.message = '';
      state.error = null;
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;

export default registerSlice.reducer;
