import React, { FC } from 'react';
import { Provider as ReduxProvider, useSelector } from 'react-redux';

import { CssBaseline, ThemeProvider } from '@mui/material';

import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import { AuthProvider } from '@contexts/auth';
import { persistor, store } from '@redux/store';
import theme from '@theme/theme';

import WalletConfig from '@components/WalletConfig';
import { queryClient } from '@lib/react-query';
import { selectWalletConfig } from '@redux/selector';
import { QueryClientProvider } from '@tanstack/react-query';
import { demoConfigs } from '../../demo/config';
import { Message } from './Message';
import { PersistGate } from 'redux-persist/integration/react';

export const LoginCheckPage: FC = () => {
  return (
    <DefaultErrorBoundary>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <StatefulWallet />
        </PersistGate>
      </ReduxProvider>
    </DefaultErrorBoundary>
  );
};

const StatefulWallet: React.FC = () => {
  // HACK: safari do NOT share localStorage in iframe and non-iframe
  //       used an default standalone gryfyn config to enable auto sign in
  const storedConfig = useSelector(selectWalletConfig);
  const hasStoredConfig = Boolean(storedConfig.hostName);
  // isOpen needs to be true to dispatch the wallet config
  const isOpen = true;

  return (
    <ThemeProvider theme={theme()}>
      <CssBaseline />
      <WalletConfig
        walletProps={{
          isOpen,
          handleClose: () => false,
          config: hasStoredConfig ? storedConfig : demoConfigs.standalone,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Message />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};
