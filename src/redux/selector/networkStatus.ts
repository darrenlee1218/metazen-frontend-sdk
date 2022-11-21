import { createSelector } from '@reduxjs/toolkit';
import { NetworkStatusProps } from '@gryfyn-types/props/NetworkStatusProps';

const applicationNetworkStatus = (state: { networkStatus: NetworkStatusProps }) => {
  return state.networkStatus;
};

export const getApplicationNetworkStatus = createSelector(applicationNetworkStatus, (networkStatus) => networkStatus);
