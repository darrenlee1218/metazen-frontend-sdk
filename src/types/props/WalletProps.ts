import { CSSProperties } from 'react';
import { DeepPartial } from '@gryfyn-types/generics';
import { CustomPalette } from '@mui/material/styles';

export interface WalletConfig {
  hostName: string;
  primaryChainId: string[];
  supportedNetworks: string[];
  gameIconUrl: string;
  companyIconUrl: string;

  joinTokenLists?: boolean;
  joinCollectionLists?: boolean;

  /**
   * Provide allowed paths (eg. '/', 'recent-activity')
   */
  tabWhitelist: string[];
  additionalPalette?: DeepPartial<CustomPalette>;

  relevantTokens: string[];
  relevantNfts: string[];

  qrScannerEnabled?: boolean;

  /**
   * Overrides the default icon in the Home tab
   * The default icon will the home icon
   */
  homeIcon?: string;
  homeBackground?: string;
  brandTextSvg?: string;

  // Default: 360px
  width?: CSSProperties['width'];
  // Default: 480px
  height?: CSSProperties['height'];
}

export interface WalletProps {
  isOpen: boolean;
  handleClose: () => void;
  config: WalletConfig;
}

export interface StatefulWalletProps {
  isOpen: boolean;
  handleClose: () => void;
}
