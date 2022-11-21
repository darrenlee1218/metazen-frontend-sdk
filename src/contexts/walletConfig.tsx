import React, { FC, useState, Dispatch, SetStateAction, createContext } from 'react';
import { WalletConfig } from '@gryfyn-types/props/WalletProps';

const DEFAULT_WALLET_CONFIG: WalletConfig = {
  hostName: '',
  primaryChainId: [],
  supportedNetworks: [],
  relevantTokens: [],
  relevantNfts: [],
  gameIconUrl: '',
  tabWhitelist: [],
  additionalPalette: {},
  homeIcon: '',
  homeBackground: '',
  companyIconUrl: '',
};

export interface WalletConfigContextValue {
  config: WalletConfig;
  setConfig: Dispatch<SetStateAction<WalletConfig>>;
}

export const WalletConfigContext = createContext<WalletConfigContextValue>({
  config: DEFAULT_WALLET_CONFIG,
  setConfig: () => {},
});

export const WalletConextProvider: FC<any> = (props) => {
  const [config, setConfig] = useState<WalletConfig>(DEFAULT_WALLET_CONFIG);
  return <WalletConfigContext.Provider value={{ config, setConfig }}>{props.children}</WalletConfigContext.Provider>;
};
