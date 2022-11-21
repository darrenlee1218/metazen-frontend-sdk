import { boxCreator } from '@components/boxCreator';
import { AssetVariant, NftAssetTile } from '@components/NftAssetTile';
import { NftAssetTileSkeleton } from '@components/NftAssetTile/NftAssetTileSkeleton';
import { OtherItemsCollapsible } from '@components/OtherItemsCollapsible';
import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';
import { useNftCollections } from '@hooks/useNftCollections';
import { useAtom } from 'jotai';
import React, { FC, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleOtherCollections } from './atoms';
import { Box } from '@mui/material';
import { styled } from '@mui/system';

const GameCollectionListRoot = boxCreator({
  px: 3,
  py: 1.5,
});

const CollectionGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: 2,
}));

interface GameCollectionListProps {
  onFetchError: () => void;
}

export const GameCollectionList: FC<GameCollectionListProps> = ({ onFetchError }) => {
  const [isOpen, toggleIsOpen] = useAtom(toggleOtherCollections);
  const navigate = useNavigate();
  const { isLoading, relevantNftCollection, otherNftCollections, isLoadBalanceError, isLoadTokenError } =
    useNftCollections();

  const generateClickHandler = useCallback(
    (nftCollection: TransformedNftCollection) => () => {
      navigate(`/game-collection/${nftCollection.id}`);
    },
    [navigate],
  );

  useEffect(() => {
    if (isLoadBalanceError || isLoadTokenError) {
      onFetchError();
    }
  }, [isLoadTokenError, isLoadBalanceError, onFetchError]);

  return (
    <GameCollectionListRoot>
      <CollectionGrid sx={{ mb: 1.5 }}>
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => <NftAssetTileSkeleton key={i} />)
          : relevantNftCollection.map((collection) => (
              <NftAssetTile
                key={collection.id}
                variant={AssetVariant.Collection}
                assetIconUrl={collection.iconUrl}
                assetName={collection.displayName}
                assetQuantity={collection.numUniqueItems}
                networkIconUrl={collection.pngNetworkIconUrl}
                onClick={generateClickHandler(collection)}
              />
            ))}
      </CollectionGrid>

      {!isLoading && (
        <OtherItemsCollapsible
          label={`Other NFTs (${otherNftCollections.length})`}
          numItems={otherNftCollections.length}
          isOpen={isOpen}
          onClick={toggleIsOpen}
        >
          <CollectionGrid sx={{ mt: 1.5 }}>
            {otherNftCollections.map((collection) => (
              <NftAssetTile
                key={collection.id}
                variant={AssetVariant.Collection}
                assetIconUrl={collection.iconUrl}
                assetName={collection.displayName}
                assetQuantity={collection.numUniqueItems}
                networkIconUrl={collection.pngNetworkIconUrl}
                onClick={generateClickHandler(collection)}
              />
            ))}
          </CollectionGrid>
        </OtherItemsCollapsible>
      )}
    </GameCollectionListRoot>
  );
};
