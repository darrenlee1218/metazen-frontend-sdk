import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import { AssetReceiveScreen, ReceiveVariant } from '@components/AssetReceiveScreen';

import { useLocationStateData } from '@hooks/useLocationStateData';
import { useCurrentWalletAddress } from '@hooks/useCurrentWalletAddress';

import { useSnackbar } from '@lib/snackbar';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';

export const DepositPage = () => {
  const navigate = useNavigate();
  const tokenBalance = useLocationStateData<TokenBalance>() as TokenBalance;
  const { walletAddress, isLoadWalletAddressError } = useCurrentWalletAddress(tokenBalance.token.chain.chainID);
  const { enqueueSnackbar } = useSnackbar();

  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBackPress = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    isLoadWalletAddressError && enqueueSnackbar('Unable to fetch wallet address', { variant: 'error' });
  }, [isLoadWalletAddressError]);

  if (!walletAddress) return null;

  return (
    <DefaultErrorBoundary>
      <AssetReceiveScreen
        variant={ReceiveVariant.Token}
        recipientAddress={walletAddress}
        displayName={tokenBalance.token.ticker}
        chainName={tokenBalance.token.chain.chainName}
        networkIconUrl={tokenBalance.token.network.pngNetworkIconUrl}
        balance={tokenBalance}
        onClose={handleClose}
        onBackPress={handleBackPress}
      />
    </DefaultErrorBoundary>
  );
};
