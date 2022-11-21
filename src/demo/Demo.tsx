import React, { FC, useCallback, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@components/Button';

import backgroundRevvRacingSrc from './assets/revv-racing/Revv-Racing-Background.png';
import { demoConfigs } from './config';
import { Wallet } from '../Wallet';

type WalletName = 'standalone' | 'revv' | 'dustland';

export const Demo: FC = () => {
  const [selectedWalletName, setSelectedWalletName] = useState<WalletName | null>(null);

  const handleClose = useCallback(() => {
    setSelectedWalletName(null);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${backgroundRevvRacingSrc})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Button sx={{ m: 1 }} onClick={() => setSelectedWalletName('standalone')} variant="contained">
          Open Demo Wallet
        </Button>

        <Button sx={{ m: 1 }} onClick={() => setSelectedWalletName('revv')} variant="contained">
          Open Revv Racing Wallet
        </Button>
        {process.env.REACT_APP_VERSION ? `v${process.env.REACT_APP_VERSION}` : ''}
      </Box>

      <MemoryRouter>
        <Wallet
          isOpen={Boolean(selectedWalletName)}
          handleClose={handleClose}
          config={demoConfigs[selectedWalletName!] ?? {}}
        />
      </MemoryRouter>
    </Box>
  );
};
