import { NftDetailsStatusProps } from '@gryfyn-types/props/NftDetailsStatusProps';
import { createSelector } from '@reduxjs/toolkit';

const nftDetailsPageStatus = (state: { nftDetailsStatus: NftDetailsStatusProps }): NftDetailsStatusProps =>
  state.nftDetailsStatus;

export const getNftDetailsPageStatus = createSelector(nftDetailsPageStatus, (refreshStatus) => refreshStatus);
