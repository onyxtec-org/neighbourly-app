import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../../api/client'; // your custom axios instance

// Utility to flatten services and build category map
const extractServicesAndCategories = categories => {
  let services = [];
  let categoryMap = {};

  const processCategory = category => {
    // Add to category map
    categoryMap[category.id] = category.name;

    // Add services under this category
    if (category.services) {
      category.services.forEach(service => {
        services.push({
          id: service.id.toString(),
          name: service.name,
          description: service.description || '',
          icon: 'construct', // placeholder icon
          category_id: category.id,
        });
      });
    }

    // Recursively handle children
    if (category.children?.length > 0) {
      category.children.forEach(processCategory);
    }
  };

  categories.forEach(processCategory);
  return { services, categoryMap };
};

// Thunk to fetch services
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await apiClient.get('/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, data } = response.data;

      if (success && data.categories) {
        const { services, categoryMap } = extractServicesAndCategories(
          data.categories,
        );
        return { services, categoryMap };
      } else {
        return rejectWithValue('Failed to fetch categories');
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const addServices = createAsyncThunk(
  'services/addServices',
  async (body, { rejectWithValue }) => {
    try {
      console.log('body',body);
      
      const response = await apiClient.post(`/user/services`, body);
      console.log('add services API response:', response.data);

      const { success, data,statusCode, message } = response.data;

      if (success && data) {
        
        return {data,statusCode,message}; // Return response
      } else {
        return rejectWithValue('Failed to add service');
      }
    } catch (error) {
      console.log(
        '❌ add service error:',
        error.response?.data || error.message,
      );
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

// Slice
const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    categoryMap: {},
    status: 'idle',
    error: null,
    addStatus: 'idle',
    addError: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.services = action.payload.services;
        state.categoryMap = action.payload.categoryMap;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addServices.pending, state => {
        state.addStatus = 'loading';
        state.addError = null;
      })
      .addCase(addServices.fulfilled, (state, action) => {
        state.addStatus = 'succeeded';
      })
      .addCase(addServices.rejected, (state, action) => {
        state.addStatus = 'failed';
        state.addError = action.payload;
      });
  },
});

export default servicesSlice.reducer;
