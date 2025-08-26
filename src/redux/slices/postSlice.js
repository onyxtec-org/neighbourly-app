import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../api/client'; // normal axios instance
import formApiClient from '../../api/formApiClient';
import storage from '../../app/storage';

export const createPost = createAsyncThunk(
    'post/createPost',
    async (postData, { rejectWithValue }) => {
      try {
        const token = await storage.getToken();
  
        const response = await formApiClient.post('/posts', postData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('✅ Post successfully created:', response.data);
        return response.data;
      } catch (error) {
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
    }
  );
  

// ✅ Get All Posts
export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const token = await storage.getToken();
      const response = await apiClient.get('/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📌 Posts data:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Get Posts Error:', error);
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);export const likePost = createAsyncThunk(
    'post/likePost',
    async (postId, { rejectWithValue }) => {
      try {
        const token = await storage.getToken();
        const user = await storage.getUser(); // ✅ current user id
        const response = await apiClient.post(
          `/posts/${postId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        return { postId, data: response.data , userId: user.id };
      } catch (error) {
        return rejectWithValue(
          error.response?.data || { message: 'Error liking post' }
        );
      }
    }
  );
  
  // 👉 Unlike Post
  export const unlikePost = createAsyncThunk(
    'post/unlikePost',
    async (postId, { rejectWithValue }) => {
      try {
        const token = await storage.getToken();
        const user = await storage.getUser(); // ✅ current user id
        const response = await apiClient.delete(`/posts/${postId}/like`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        return { postId, data: response.data , userId: user.id };
      } catch (error) {
        return rejectWithValue(
          error.response?.data || { message: 'Error unliking post' }
        );
      }
    }
  );

const postSlice = createSlice({
  name: 'post',
  initialState: {
    loading: false,
    success: false,
    error: null,
    posts: [],
  },
  reducers: {
    resetPostState: (state) => {
      state.posts = [];
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    removePostById: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 👉 Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      
        const newPost = action.payload?.data?.post;
        if (newPost) {
          state.posts.unshift(newPost); // add on top
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Error creating post';
      })

      // 👉 Get Posts
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      
        // ✅ API shape: action.payload.data.posts
        state.posts = action.payload?.data?.posts || [];
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Error fetching posts';
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post) {
          if (!post.likes) post.likes = [];
          const alreadyLiked = post.likes.some(l => l.user_id === userId);
          if (!alreadyLiked) post.likes.push({ user_id: userId });
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload?.message || 'Error liking post';
      })
    
      // 👉 Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find(p => p.id === postId);
        if (post && post.likes) {
          post.likes = post.likes.filter(l => l.user_id !== userId);
        }
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.error = action.payload?.message || 'Error unliking post';
      });
  },
});

export const { resetPostState, setPosts, removePostById } = postSlice.actions;
export default postSlice.reducer;
