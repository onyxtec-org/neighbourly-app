import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client';

export const registerUser = createAsyncThunk(
  'register/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // ✅ Append all values explicitly
      formData.append('name', userData.name ?? '');
      formData.append('email', userData.email ?? '');
      formData.append('password', userData.password ?? '');
      formData.append('password_confirmation', userData.password_confirmation ?? '');
      formData.append('phone', userData.phone ?? '');
      formData.append('country_code', userData.country_code ?? '');
      formData.append('location', userData.location ?? '');
      formData.append('location_lng', userData.location_lng ?? '');
      formData.append('location_lat', userData.location_lat ?? '');
      formData.append('role', userData.role ?? 'consumer');

      if (userData.image?.uri) {
        const filename = userData.image.uri.split('/').pop();
        const ext = filename.split('.').pop();
        formData.append('image', {
          uri: userData.image.uri,
          name: filename,
          type: `image/${ext}`,
        });
      }

      // 🔍 Debug: Log form data keys
      for (let pair of formData._parts) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const response = await apiClient.post('/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const res = response.data;

      console.log('✅ API RESPONSE:', res);

      if (!res.success) {
        return rejectWithValue({
          message: res.message || 'Registration failed',
          data: res.data || null,
        });
      }

      return res;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || 'Unexpected error';

      return rejectWithValue({
        message,
        data: error.response?.data?.data,
      });
    }
  }
);
