import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletConfig } from '@gryfyn-types/props/WalletProps';

const initialState: WalletConfig = {
  hostName: '',
  supportedNetworks: [],
  primaryChainId: [],
  gameIconUrl: '',
  tabWhitelist: [],
  relevantTokens: [],
  relevantNfts: [],
  companyIconUrl: '',
  qrScannerEnabled: false,
  joinTokenLists: true,
  joinCollectionLists: true,
};

export const walletConfigSlice = createSlice({
  name: 'walletConfig',
  initialState,
  reducers: {
    setWalletConfig(state, action: PayloadAction<WalletConfig>) {
      if (!action.payload.primaryChainId.length) {
        return;
      }

      state.width = action.payload.width;
      state.height = action.payload.height;
      state.hostName = action.payload.hostName;
      state.primaryChainId = action.payload.primaryChainId;
      state.supportedNetworks = action.payload.supportedNetworks;
      state.gameIconUrl = action.payload.gameIconUrl;
      state.companyIconUrl = action.payload.companyIconUrl;
      state.additionalPalette = action.payload.additionalPalette;
      state.tabWhitelist = action.payload.tabWhitelist;
      state.homeIcon = action.payload.homeIcon;
      state.homeBackground = action.payload.homeBackground;
      state.brandTextSvg = action.payload.brandTextSvg;
      state.relevantTokens = action.payload.relevantTokens;
      state.relevantNfts = action.payload.relevantNfts;

      state.qrScannerEnabled = action.payload.qrScannerEnabled;
      state.joinTokenLists = action.payload.joinTokenLists;
      state.joinCollectionLists = action.payload.joinCollectionLists;
    },
  },
});

export const { setWalletConfig } = walletConfigSlice.actions;
