import { NftDetailsStatusProps } from '@gryfyn-types/props/NftDetailsStatusProps';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: NftDetailsStatusProps = {
  forceRefresh: false,
};

export const nftDetailsStatusSlice = createSlice({
  name: 'nftDetailsStatus',
  initialState,
  reducers: {
    setRefreshNftDetails(state, action: PayloadAction<NftDetailsStatusProps>) {
      state.forceRefresh = action.payload.forceRefresh;
    },
  },
});

export const { setRefreshNftDetails } = nftDetailsStatusSlice.actions;
