import React, { FC, useMemo } from 'react';
import { useNftCollections } from '@hooks/useNftCollections';
import { useParams } from 'react-router-dom';
import DefaultErrorBoundary from '@components/DefaultErrorBoundary';
import { CollectionHeader } from './CollectionHeader';
import { CollectionItemList } from './CollectionItemList';
import { boxCreator } from '@components/boxCreator';

const Root = boxCreator({
  display: 'flex',
  flex: '1 0 auto',
  flexDirection: 'column',
  width: '100%',
});

export const GameCollectionDetail: FC = () => {
  const { assetKey: collectionKey } = useParams<{ assetKey: string }>();
  const { allCollections } = useNftCollections();

  const nftCollection = useMemo(() => {
    return allCollections.find((token) => token.id === collectionKey);
  }, [allCollections, collectionKey]);

  if (!nftCollection) return null;

  return (
    <DefaultErrorBoundary>
      <Root>
        <CollectionHeader nftCollection={nftCollection} />
        <CollectionItemList nftCollection={nftCollection} />
      </Root>
    </DefaultErrorBoundary>
  );
};
