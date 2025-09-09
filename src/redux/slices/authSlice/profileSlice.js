// redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';
import storage from '../../../app/storage';
import { logoutUser } from '../../thunks/auth/logoutThunk';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async ({ userId, authId = null }, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();
      console.log(' Token fetched inside thunk:', token);
      console.log(' User ID passed to thunk:', userId);
      console.log(' Auth ID passed to thunk:', authId);

      const response = await apiClient.get(`/profile/${userId}`);

      console.log('Profile API response:', response.data);

      const { success, data } = response.data;
      if (success && data) {
        return { data, userId, authId }; // ✅ return both fetched data & IDs
      } else {
        return rejectWithValue('Failed to fetch profile');
      }
    } catch (error) {
      console.log('Profile API error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  },
);

// profileSlice.js
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();

      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await apiClient.delete(`/account`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(' Delete account response:', response.data);

      if (response.data.success) {
        // Clear storage after deletion
        await storage.removeToken();
        await storage.removeUser();
        return true;
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.log(' Delete account error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Something went wrong');
    }
  },
);

export const switchUserProfile = createAsyncThunk(
  'profile/switchUserProfile',
  async (body,{ rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/switch-profile`,body);
      console.log('✅ switch profile API response:', response.data);

      const { success, data } = response.data;

      if (success && data) {
        return data; // Return the updated user data
      } else {
        return rejectWithValue('Failed to switch profile');
      }
    } catch (error) {
      console.log(
        'switch profile error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
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
    resetProfile: state => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    setUserRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder

      .addCase(fetchUserProfile.pending, state => {
        state.status = 'loading';
      })
.addCase(fetchUserProfile.fulfilled, (state, action) => {
  state.status = 'succeeded';

  const { data: fetchedUser, userId, authId } = action.payload;

  if (!authId || authId === userId) {
    // ✅ If authId is null/undefined OR matches userId, update state.user
    state.user = fetchedUser;
  } else {
    // ✅ If authId exists and is different, just log and skip state update
    console.log('✅ Different user profile fetched, not updating state.user');
  }
})


      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Switch profile cases
      .addCase(switchUserProfile.pending, state => {
        state.status = 'switching';
      })
      .addCase(switchUserProfile.fulfilled, (state, action) => {
        state.status = 'switched';
        state.user = action.payload;
      })
      .addCase(switchUserProfile.rejected, (state, action) => {
        state.status = 'switch_failed';
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.status = 'deleted';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = 'delete_failed';
        state.error = action.payload;
      });
  },
});
export const { resetProfile, setUserRole } = profileSlice.actions;
export default profileSlice.reducer;
