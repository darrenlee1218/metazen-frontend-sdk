import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {},
  reducers: {
    clearAll() {},
  },
});

export const { clearAll } = appSlice.actions;
