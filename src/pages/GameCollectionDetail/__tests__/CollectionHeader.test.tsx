import React, { ComponentProps } from 'react';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { CollectionHeader } from '../CollectionHeader';
import { mockImport } from '@utils/testing/mockImport';
import { useNavigate } from 'react-router-dom';
import { TestProviders } from '@utils/testing/TestProviders';
import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';

jest.mock('react-router-dom');
const mockedUseNavigate = mockImport(useNavigate);

afterEach(cleanup);

const defaultProps: ComponentProps<typeof CollectionHeader> = {
  nftCollection: {
    iconUrl: 'icon.png',
    nftCollectionBackgroundImageUrl: 'background.png',
    displayName: 'REVV Collection',
    numUniqueItems: '10',
    externalLinks: {
      website: 'https://www.revvracing.com/',
      twitter: 'https://twitter.com/REVV_Racing',
      opensea: 'https://opensea.io/collection/revv-motorsport-inventory',
    },
  } as unknown as TransformedNftCollection,
};

it('should render the number of items', () => {
  mockedUseNavigate.mockImplementation((() => {}) as unknown as any);
  render(<CollectionHeader {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByTestId('item-count')).toHaveTextContent('10 items');
});

it('should render the collection name', () => {
  mockedUseNavigate.mockImplementation((() => {}) as unknown as any);
  render(<CollectionHeader {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByText(defaultProps.nftCollection.displayName)).toBeInTheDocument();
});

it.each([['website'], ['twitter'], ['opensea']])(
  'should render a tooltip when the user hovers over %s button',
  async (link) => {
    mockedUseNavigate.mockImplementation((() => {}) as unknown as any);
    render(<CollectionHeader {...defaultProps} />, { wrapper: TestProviders });

    fireEvent.mouseOver(screen.getByTestId(`${link}-redirect`));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
  },
);
