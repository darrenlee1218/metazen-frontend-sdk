import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { GameCollectionDetail } from '..';
import { mockImport } from '@utils/testing/mockImport';
import { useNftCollections } from '@hooks/useNftCollections';
import { useGetAssetMetadataQuery } from '@redux/api/assetMetadataCache';
import { useParams } from 'react-router-dom';

afterEach(cleanup);

jest.mock('react-router-dom');
const mockedUseParams = mockImport(useParams);

jest.mock('@hooks/useNftCollections');
const mockedUseNftCollections = mockImport(useNftCollections);

it('should render nothing if nftCollection is falsey', () => {
  mockedUseParams.mockReturnValue({ assetKey: '' });
  mockedUseNftCollections.mockReturnValue({ allCollections: [] } as unknown as any);
  const { container } = render(<GameCollectionDetail />);
  expect(container).toMatchInlineSnapshot('<div />');
});
