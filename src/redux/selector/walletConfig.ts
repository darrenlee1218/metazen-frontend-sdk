import { createSelector } from '@reduxjs/toolkit';
import { WalletConfig } from '@gryfyn-types/props/WalletProps';

export const selectWalletConfig = (state: { walletConfig: WalletConfig }) => state.walletConfig;

// although it name like this, it is an array of supported network
export const selectSupportedNetworks = createSelector(
  selectWalletConfig,
  (walletConfig) => walletConfig.primaryChainId,
);

export const selectTabWhitelist = createSelector(selectWalletConfig, (walletConfig) => walletConfig.tabWhitelist);

export const selectHomeIcon = createSelector(selectWalletConfig, (walletConfig) => walletConfig.homeIcon);
export const selectHostName = createSelector(selectWalletConfig, (walletConfig) => walletConfig.hostName);

export const selectHomeBackground = createSelector(selectWalletConfig, (walletConfig) => walletConfig.homeBackground);
export const selectBrandTextSvg = createSelector(selectWalletConfig, (walletConfig) => walletConfig.brandTextSvg);

export const checkQrScanBool = createSelector(selectWalletConfig, (walletConfig) => walletConfig.qrScannerEnabled);
export const checkJoinTokenLists = createSelector(selectWalletConfig, (walletConfig) => walletConfig.joinTokenLists);
export const checkJoinCollectionLists = createSelector(
  selectWalletConfig,
  (walletConfig) => walletConfig.joinCollectionLists,
);

export const selectRelevantTokens = createSelector(
  selectWalletConfig,
  (walletConfig) => walletConfig.relevantTokens ?? [],
);
export const selectRelevantNfts = createSelector(selectWalletConfig, (walletConfig) => walletConfig.relevantNfts ?? []);
