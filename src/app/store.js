import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../viewmodels/user/userSlice'; // 👈 Your feature slice

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add more reducers here
  },
});

export default store;
