import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import formApiClient from '../../api/formApiClient'; // <-- 👈 new import
import apiClient from '../../api/client';
import storage from '../../app/storage';

export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      console.log('🧾 FormData being sent:', jobData);

      const response = await formApiClient.post('/jobs', jobData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Job successfully created:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Create Job Error (caught in catch):', error);

      if (error?.response) {
        return rejectWithValue({
          message: 'Server error',
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error?.request) {
        return rejectWithValue({ message: 'No response received from server' });
      } else {
        return rejectWithValue({
          message: error.message || 'Unknown error occurred',
        });
      }
    }
  },
);

export const getJobs = createAsyncThunk(
  'job/getJob',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/jobs');

      return response.data;
    } catch (error) {
      console.log('Get Job Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' },
      );
    }
  },
);

const jobSlice = createSlice({
  name: 'job',
  initialState: {
    loading: false,
    success: false,
    error: null,
    jobs: [],
  },
  reducers: {
    resetJobState: state => {
      state.jobs = [];
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    setJobs(state, action) {
      state.jobs = action.payload;
    },
    removeJobById(state, action) {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createJob.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createJob.fulfilled, state => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Error creating job';
      })
      .addCase(getJobs.pending, state => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.jobs = action.payload.data.jobs; // ✅ Store the array of jobs
      })
      .addCase(getJobs.rejected, (state, action) => {
        console.log('❌ Job Creation Failed:', action.payload || action.error);
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Error Getting jobs';
      });
  },
});

export const { resetJobState, setJobs, removeJobById } = jobSlice.actions;
export default jobSlice.reducer;
