import { createSlice } from '@reduxjs/toolkit';
import { loginUser } from '../../thunks/auth/loginThunk';
import { logoutUser } from '../../thunks/auth/logoutThunk'; // ✅ ADD THIS

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    user: null,
    token: null,
    success: false,
    error: null,
  },
  reducers: {
    resetLoginState: state => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.success = false;
      state.error = null;
    },
    setLoginUser: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      state.success = true;
      state.loading = false;
      state.error = null;
    },
  },
  
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'Login failed' };
      })
      // ✅ LOGOUT CASE TO RESET STATE
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.success = false;
        state.error = null;
      });
  },
});

export const { resetLoginState, setLoginUser } = loginSlice.actions;
export default loginSlice.reducer;
