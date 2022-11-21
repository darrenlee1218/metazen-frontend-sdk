import React from 'react';
import { useWalletInitial } from '@hooks/useWalletInitial';

interface WalletInitialProviderProps {
  children: React.ReactElement;
}

export const WalletInitialProvider: React.FC<WalletInitialProviderProps> = ({ children }) => {
  const isLoading = useWalletInitial();
  return isLoading ? null : children;
};
