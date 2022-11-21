import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getApplicationNetworkStatus } from '@redux/selector';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';

import { defaultNftAssetMetadata } from '@gryfyn-types/data-transfer-objects/DefaultNftAssetMetadata';
import NftTokenDetailsRouteParams from '@gryfyn-types/data-transfer-objects/NftTokenDetailsRouteParams';

import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import GameCollectionDetailsContainer from '@pages/GameCollectionDetails/GameCollectionDetailsContainer';

import NftLoadingNotification from './NftLoadingNotification';
import NftDetailsErrorNotification from './NftDetailsErrorNotification';

const GameCollectionDetails = () => {
  const location = useLocation();
  const { chainId, contractAddress, nftTokenId, sendNavRoute, address, chain } =
    location.state as NftTokenDetailsRouteParams;

  const {
    data: nftAssetMetadata,
    isLoading,
    isError,
  } = useGetAssetMetadataQuery(
    {
      chainId,
      contractAddress,
      tokenId: nftTokenId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const { forceRefresh: refreshComponent } = useSelector(getApplicationNetworkStatus);
  return (
    <main>
      <DefaultErrorBoundary>
        <NftLoadingNotification loading={isLoading} message="Refreshing metadata, can take up to a minute" />
        <GameCollectionDetailsContainer
          nftAssetMetadata={nftAssetMetadata ?? defaultNftAssetMetadata}
          sendNavRoute={sendNavRoute}
          address={address}
          chain={chain}
        />
        <NftDetailsErrorNotification isError={isError} refreshComponent={refreshComponent} />
      </DefaultErrorBoundary>
    </main>
  );
};

export default GameCollectionDetails;
