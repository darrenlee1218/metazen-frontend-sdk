import React, { FC, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AssetReceiveScreen, ReceiveVariant } from '@components/AssetReceiveScreen';

import { useTokenByKey } from '@hooks/useTokenByKey';
import { useCurrentWalletAddress } from '@hooks/useCurrentWalletAddress';

export const GameCollectionReceive: FC = () => {
  const navigate = useNavigate();
  const { key } = useParams<{ key: string }>();
  const collection = useTokenByKey(key!);
  const { walletAddress } = useCurrentWalletAddress(collection?.chain.chainID);

  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBackPress = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  if (!walletAddress) {
    if (key === ':key' || key === '' || !key) {
      navigate('/game-collection-details', {
        state: { error: 'Route is invalid. NFT Collection key does not exist...' },
      });
    }
    return null;
  }

  if (!collection) {
    navigate('/game-collection-details', {
      state: { error: 'Route is invalid. NFT Collection does not exist...' },
    });
    return null;
  }

  return (
    <AssetReceiveScreen
      variant={ReceiveVariant.Nft}
      displayName={collection.displayName}
      recipientAddress={walletAddress}
      chainName={collection.chain.chainName}
      networkIconUrl={collection.network.pngNetworkIconUrl}
      onClose={handleClose}
      onBackPress={handleBackPress}
    />
  );
};
