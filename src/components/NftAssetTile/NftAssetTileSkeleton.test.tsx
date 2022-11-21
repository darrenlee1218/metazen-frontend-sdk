import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { NftAssetTileSkeleton } from './NftAssetTileSkeleton';
import { TestProviders } from '@utils/testing/TestProviders';

afterEach(cleanup);

it('matches snapshot', () => {
  const { container } = render(<NftAssetTileSkeleton />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
