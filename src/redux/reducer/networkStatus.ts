import { NetworkStatusProps } from '@gryfyn-types/props/NetworkStatusProps';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: NetworkStatusProps = {
  appNetworkStatus: 'success',
  sourceComponent: '/',
  forceRefresh: false,
};

export const networkStatusSlice = createSlice({
  name: 'networkStatus',
  initialState,
  reducers: {
    setNetworkStatus(state, action: PayloadAction<NetworkStatusProps>) {
      state.appNetworkStatus = action.payload.appNetworkStatus;
      state.sourceComponent = action.payload.sourceComponent;
      state.forceRefresh = action.payload.forceRefresh;
    },
  },
});

export const { setNetworkStatus } = networkStatusSlice.actions;
