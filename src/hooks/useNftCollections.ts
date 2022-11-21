import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectRelevantNfts, checkJoinCollectionLists } from '@redux/selector';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useGetBalancesByAssetIdsQuery } from '@redux/api/bookKeeping';

import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';
import { groupBy } from '@utils/groupBy';
import BigNumber from 'bignumber.js';
import { API_CONSTANTS } from '@constants/api';

export const useNftCollections = () => {
  const relevantNfts = useSelector(selectRelevantNfts);
  const checkJoinCollection = useSelector(checkJoinCollectionLists);

  const { data: tokens = [], isLoading: isLoadingTokens, isError: isLoadTokenError } = useGetTokensQuery();

  // Asset Master only returns NFT Collections
  const nftCollections = useMemo(
    () => tokens.filter((token) => ['ERC-721', 'ERC-1155'].includes(token.standard)),
    [tokens],
  );

  const {
    data: nftCollectionBalances = [],
    isLoading: isLoadingBalances,
    isError: isLoadBalanceError,
  } = useGetBalancesByAssetIdsQuery(
    {
      assetIds: nftCollections.map((token) => token.key),
      aggregateNfts: false,
    },
    {
      pollingInterval: API_CONSTANTS.ASSET_POLLING_INTERVAL_MS,
    },
  );

  const groupedNftItems = useMemo(() => groupBy(nftCollectionBalances, 'assetId'), [nftCollectionBalances]);

  const transformedTokens = useMemo(
    () =>
      nftCollections.map<TransformedNftCollection>((token) => ({
        displayName: token.displayName,
        iconUrl: token.display.nftCollectionImageUrl ?? '',
        nftCollectionBackgroundImageUrl: token.display.nftCollectionBackgroundImageUrl ?? '',
        nftPngImage: token.display.pngIconUrl ?? '',
        nftSvgImage: token.display.svgIconUrl ?? '',
        contractAddress: token.contractAddress!,
        chain: token.chain,
        id: token.key,
        pngNetworkIconUrl: token.network.pngNetworkIconUrl ?? '',
        numUniqueItems: isLoadingBalances
          ? undefined
          : groupedNftItems[token.key]?.filter((item) => new BigNumber(item.balance).isGreaterThan(0)).length ?? 0,
        // Per requirements, temporarily hard code links
        externalLinks: {
          website: 'https://www.revvracing.com/',
          twitter: 'https://twitter.com/REVV_Racing',
          opensea: 'https://opensea.io/collection/revv-motorsport-inventory',
        },
      })),
    [groupedNftItems, isLoadingBalances, nftCollections],
  );

  const isRelevantNftCollection = useCallback(
    (token: TransformedNftCollection) => Boolean(relevantNfts.find((nftKey) => token.id === nftKey)),
    [relevantNfts],
  );

  const isNotRelevantNftCollection = useCallback(
    (token: TransformedNftCollection) => !isRelevantNftCollection(token),
    [isRelevantNftCollection],
  );

  const defaultNftList = useMemo(
    () => [
      ...transformedTokens.filter(isRelevantNftCollection),
      ...transformedTokens.filter(isNotRelevantNftCollection).filter((collection) => collection.numUniqueItems !== 0),
    ],
    [transformedTokens, isRelevantNftCollection, isNotRelevantNftCollection],
  );

  return useMemo(
    () => ({
      isLoadTokenError,
      isLoadBalanceError,
      isLoading: isLoadingTokens,
      allCollections: transformedTokens,
      relevantNftCollection: checkJoinCollection ? defaultNftList : transformedTokens.filter(isRelevantNftCollection),
      otherNftCollections: checkJoinCollection
        ? []
        : transformedTokens.filter(isNotRelevantNftCollection).filter((collection) => collection.numUniqueItems !== 0),
    }),
    [
      isRelevantNftCollection,
      isLoadingTokens,
      isNotRelevantNftCollection,
      checkJoinCollection,
      defaultNftList,
      transformedTokens,
      isLoadTokenError,
      isLoadBalanceError,
    ],
  );
};
