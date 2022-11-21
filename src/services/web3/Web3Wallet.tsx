import React, { useCallback, useRef, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { WalletConfig } from '@gryfyn-types/props/WalletProps';

import { Wallet } from '../../Wallet';
import { Web3ListenerRef, Web3ListenerTest } from './web3-api-service';

const DEFAULT_WALLET_CONFIG: WalletConfig = {
  hostName: '',
  primaryChainId: [],
  supportedNetworks: [],
  gameIconUrl: '',
  tabWhitelist: [],
  additionalPalette: {},
  homeIcon: '',
  homeBackground: '',
  relevantTokens: [],
  relevantNfts: [],
  companyIconUrl: '',
};

export const Web3Wallet: React.FC = () => {
  const ref = useRef<Web3ListenerRef>(null);

  const [walletConfig, setWalletConfig] = useState<WalletConfig>(DEFAULT_WALLET_CONFIG);

  const handleOpenWallet = useCallback((config: WalletConfig) => {
    setWalletConfig(config);
  }, []);

  const handleCloseWallet = useCallback(() => {
    // setOpen(false);
    // trigger event to close wallet
    ref.current?.closeWallet();
  }, [ref]);

  return (
    <MemoryRouter>
      <Web3ListenerTest openWallet={handleOpenWallet} />
      <Wallet isOpen={true} handleClose={handleCloseWallet} config={walletConfig} />
    </MemoryRouter>
  );
};
