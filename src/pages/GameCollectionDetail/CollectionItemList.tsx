import { useNavigate } from 'react-router-dom';
import React, { ComponentProps, FC, useCallback, useEffect, useMemo, useState } from 'react';

import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { Dropdown } from '@components/Dropdown';
import { boxCreator } from '@components/boxCreator';
import { AssetVariant, NftAssetTile } from '@components/NftAssetTile';
import { NftAssetTileSkeleton } from '@components/NftAssetTile/NftAssetTileSkeleton';

import { Comparator } from '@gryfyn-types/generics';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';
import NftTokenDetailsRouteParams from '@gryfyn-types/data-transfer-objects/NftTokenDetailsRouteParams';
import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';

import { useSnackbar } from '@lib/snackbar';
import { NftItem, useNftCollectionItems } from '@hooks/useNftCollectionItems';

const ListHeader = boxCreator({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: (theme) => theme.palette.colors.appBackground,
  zIndex: 2,
  position: 'sticky',
  top: 0,
  px: 3,
  pt: 2.5,
  pb: 1.5,
});

const NoItemsBox = boxCreator({
  px: 3,
  pt: 1.5,
});

const ItemGrid = boxCreator({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 1,
  px: 3,
  pb: 3,
});

enum SortOptions {
  DateDesc = 'date-desc',
  AlphaAsc = 'alpha-asc',
  AlphaDesc = 'alpha-desc',
}

const sortOptionLabels: Record<SortOptions, string> = {
  [SortOptions.DateDesc]: 'Recently added',
  [SortOptions.AlphaAsc]: 'A-Z',
  [SortOptions.AlphaDesc]: 'Z-A',
};

const sortOptionFunctions: Record<SortOptions, Comparator<NftItem>> = {
  [SortOptions.DateDesc]: (a, b) =>
    new Date(b.metadata?.createdTime ?? 0).getTime() - new Date(a.metadata?.createdTime ?? 0).getTime(),
  [SortOptions.AlphaAsc]: (a, b) => (a.metadata?.data.name ?? '').localeCompare(b.metadata?.data.name ?? ''),
  [SortOptions.AlphaDesc]: (a, b) => (b.metadata?.data.name ?? '').localeCompare(a.metadata?.data.name ?? ''),
};

type DropdownItems = ComponentProps<typeof Dropdown>['list'];
const dropdownItems: DropdownItems = Object.entries(sortOptionLabels).map(([key, label]) => ({
  value: key,
  text: label,
}));

interface CollectionItemListProps {
  nftCollection: TransformedNftCollection;
}

export const CollectionItemList: FC<CollectionItemListProps> = ({ nftCollection }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [sortOption, setSortOption] = useState(SortOptions.DateDesc);
  const { isLoading, nftCollectionItems, isLoadTokenError } = useNftCollectionItems({
    id: nftCollection.id,
    contractAddress: nftCollection.contractAddress,
  });

  const sortedNftTokens = useMemo(
    () => [...nftCollectionItems].sort(sortOptionFunctions[sortOption]),
    [nftCollectionItems, sortOption],
  );

  const handleChange = useCallback((value: string) => {
    setSortOption(value as SortOptions);
  }, []);

  const clickHandlerGenerator = useCallback(
    ({ assetId, chainId, nftTokenId, address }: NftTokenData) =>
      () => {
        navigate('/game-collection-details', {
          state: {
            chainId,
            nftTokenId,
            contractAddress: nftCollection.contractAddress,
            sendNavRoute: `/page/game-collection/${assetId}/items/${nftTokenId}/send`,
            address,
            chain: nftCollection.chain,
          } as NftTokenDetailsRouteParams,
        });
      },
    [navigate, nftCollection.chain, nftCollection.contractAddress],
  );

  useEffect(() => {
    isLoadTokenError && enqueueSnackbar('Can’t fetch list of NFTs user owns', { variant: 'error' });
  }, [isLoadTokenError]);

  const node = useMemo(() => {
    switch (true) {
      case isLoading:
        return (
          <ItemGrid data-testid="skeleton-item-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <NftAssetTileSkeleton key={i} />
            ))}
          </ItemGrid>
        );

      case nftCollectionItems.length === 0:
        return (
          <NoItemsBox data-testid="empty-state">
            <Typography align="center" color="text.secondary" sx={{ fontSize: '12px' }}>
              You don&apos;t own any items in this collection.
            </Typography>
            <Link
              color="primary.main"
              underline="none"
              href={nftCollection.externalLinks.opensea}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Typography align="center" variant="h5">
                Shop Now
              </Typography>
            </Link>
          </NoItemsBox>
        );

      case nftCollectionItems.length > 0:
      default:
        return (
          <ItemGrid data-testid="item-grid">
            {sortedNftTokens.map((nft) => (
              <NftAssetTile
                // Asset ID may not be unique
                key={[nft.assetId, nft.nftTokenId].join('-')}
                variant={AssetVariant.Item}
                assetIconUrl={nft.metadata?.data.image ?? ''}
                assetName={nft.metadata?.data.name ?? ''}
                assetQuantity={nft.balance}
                onClick={clickHandlerGenerator(nft)}
              />
            ))}
          </ItemGrid>
        );
    }
  }, [
    clickHandlerGenerator,
    isLoading,
    nftCollection.externalLinks.opensea,
    nftCollectionItems.length,
    sortedNftTokens,
  ]);

  return (
    <>
      <ListHeader data-testid="collection-list-header">
        <Typography color="text.secondary" variant="h4">
          Your items
        </Typography>
        {sortedNftTokens.length > 0 && (
          <Dropdown
            list={dropdownItems}
            value={sortOption}
            onChange={handleChange}
            menuProps={{
              sx: {
                '& .MuiMenuItem-root': {
                  fontSize: '12px',
                },
              },
            }}
          />
        )}
      </ListHeader>

      {node}
    </>
  );
};
