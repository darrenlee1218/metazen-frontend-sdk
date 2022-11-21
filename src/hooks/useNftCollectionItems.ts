import { API_CONSTANTS } from '@constants/api';
import NftAssetMetadata from '@gryfyn-types/data-transfer-objects/NftAssetMetadata';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';
import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';
import { useGetAssetMetadataBatchQuery } from '@redux/api/assetMetadataCache';
import { useGetBalancesByAssetIdsQuery } from '@redux/api/bookKeeping';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

export interface NftItem extends NftTokenData {
  metadata?: NftAssetMetadata;
}

interface UseNftCollectionItemsResult {
  nftCollectionItems: NftItem[];
  isLoading: boolean;
  isLoadTokenError: boolean;
}

export const useNftCollectionItems = ({
  id: collectionKey,
  contractAddress,
}: Pick<TransformedNftCollection, 'id' | 'contractAddress'>): UseNftCollectionItemsResult => {
  const {
    data: nftTokens = [],
    isLoading: isLoadingTokenData,
    isError: isLoadTokenError,
  } = useGetBalancesByAssetIdsQuery(
    {
      assetIds: [collectionKey],
    },
    {
      pollingInterval: API_CONSTANTS.ASSET_POLLING_INTERVAL_MS,
    },
  );

  const filteredNftTokens = useMemo(
    () => nftTokens.filter((token) => new BigNumber(token.balance).isGreaterThan(0)),
    [nftTokens],
  );

  const { data: nftItemMetadata, isLoading: isLoadingMetadata } = useGetAssetMetadataBatchQuery(
    filteredNftTokens.map((nftItem) => ({
      chainId: nftItem.chainId,
      contractAddress,
      tokenId: nftItem.nftTokenId,
    })),
  );

  return useMemo(
    () => ({
      isLoadTokenError,
      nftCollectionItems: filteredNftTokens.map((token) => ({
        ...token,
        metadata: (nftItemMetadata ?? []).find((metadata) => metadata.tokenId === token.nftTokenId),
      })),
      isLoading: isLoadingTokenData || isLoadingMetadata,
    }),
    [filteredNftTokens, isLoadingMetadata, isLoadingTokenData, nftItemMetadata, isLoadTokenError],
  );
};
