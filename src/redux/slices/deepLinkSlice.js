// src/redux/slices/deepLinkSlice.js
import { createSlice } from '@reduxjs/toolkit';

const deepLinkSlice = createSlice({
  name: 'deepLink',
  initialState: { params: null },
  reducers: {
    setDeepLinkParams: (state, action) => {
      state.params = action.payload;
    },
    clearDeepLinkParams: (state) => {
      state.params = null;
    },
  },
});

export const { setDeepLinkParams, clearDeepLinkParams } = deepLinkSlice.actions;
export default deepLinkSlice.reducer;
