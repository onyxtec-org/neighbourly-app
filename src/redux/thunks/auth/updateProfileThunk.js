// src/redux/thunks/profile/updateProfileThunk.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../../api/client'; // Adjust path based on your structure

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', data.fullName);
      formData.append('email', data.email);
      formData.append('country_code', data.countryCode);
      formData.append('phone', data.phoneNumber);
      formData.append('location', data.address);
      formData.append('slug', data.slug);
      if (data.profileImage) {
        formData.append('image', {
          uri: data.profileImage.uri,
          name: data.profileImage.fileName || 'profile.jpg',
          type: data.profileImage.type || 'image/jpeg',
        });
      }

      const response = await apiClient.post(
        `update/profile/${id}`,
        formData,
        {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        }
      );

      return response.data?.data || response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Something went wrong while updating the profile.';
      return rejectWithValue(message);
    }
  }
);
