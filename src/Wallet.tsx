import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import Modal from '@components/Modal';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';

import WalletConfig from '@components/WalletConfig';

import { WalletProps, StatefulWalletProps } from '@gryfyn-types/props/WalletProps';

import theme from '@theme/theme';
import { AuthProvider } from '@contexts/auth';
import { AppRouter } from './pages/navigation';
// redux should import after routes to prevent dependency issues
import { persistor, store } from '@redux/store';
import { selectWalletConfig } from '@redux/selector';
import { WalletInitialProvider } from '@contexts/walletInitial';
import { KeycloakMFAModal } from '@services/mfa';
import { queryClient } from '@lib/react-query';

export const Wallet: React.FunctionComponent<WalletProps> = (props) => {
  const { isOpen, handleClose } = props;

  return (
    <DefaultErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <WalletConfig walletProps={props} />
          <StatefulWallet isOpen={isOpen} handleClose={handleClose} />
        </PersistGate>
      </ReduxProvider>
    </DefaultErrorBoundary>
  );
};

const StatefulWallet: React.FC<StatefulWalletProps> = ({ isOpen, handleClose }) => {
  const { additionalPalette, width, height } = useSelector(selectWalletConfig);

  return (
    <ThemeProvider theme={theme(additionalPalette)}>
      <CssBaseline />
      <Modal isOpen={isOpen} handleClose={handleClose} width={width} height={height}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <WalletInitialProvider>
              <JotaiProvider>
                <AppRouter onClose={handleClose} />
                <KeycloakMFAModal />
              </JotaiProvider>
            </WalletInitialProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Modal>
    </ThemeProvider>
  );
};
