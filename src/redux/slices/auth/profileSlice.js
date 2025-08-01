// redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
import storage from '../../../app/storage';
import { logoutUser } from '../../thunks/auth/logoutThunk';


export const fetchUserProfile = createAsyncThunk(
    'profile/fetchUserProfile',
    async (userId, { rejectWithValue }) => {
      try {
        const token = await storage.getToken();
        console.log('🛑 Token fetched inside thunk:', token);
        console.log('🛑 User ID passed to thunk:', userId);
  
        const response = await apiClient.get(`/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log('✅ Profile API response:', response.data);
  
        const { success, data } = response.data;
        if (success && data) {
          return data;
        } else {
          return rejectWithValue('Failed to fetch profile');
        }
      } catch (error) {
        console.log('❌ Profile API error:', error.response?.data || error.message);
        return rejectWithValue(
          error.response?.data?.message || 'Something went wrong'
        );
      }
    }
  );
  

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // ✅ Manual reset action if you want to call it yourself
    resetProfile: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
    
      .addCase(fetchUserProfile.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      });
  },
});
export const { resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
