import React, { ComponentProps } from 'react';
import { render, cleanup, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { CollectionItemList } from '../CollectionItemList';
import { mockImport } from '@utils/testing/mockImport';
import { useNavigate } from 'react-router-dom';
import { TestProviders } from '@utils/testing/TestProviders';
import { constants } from 'ethers';
import { TransformedNftCollection } from '@gryfyn-types/data-transfer-objects/TransformedNftCollection';
import { NftItem, useNftCollectionItems } from '@hooks/useNftCollectionItems';

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));

jest.mock('react-router-dom');
const mockedUseNavigate = mockImport(useNavigate);

jest.mock('@hooks/useNftCollectionItems');
const mockedUseNftCollectionItems = mockImport(useNftCollectionItems);

const mockNftItems = [
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '1',
    metadata: {
      createdTime: 2020,
      data: {
        name: 'A',
      },
    },
  },
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '2',
    metadata: {
      createdTime: 2022,
      data: {
        name: 'B',
      },
    },
  },
  {
    chainId: '0',
    contractAddress: constants.AddressZero,
    nftTokenId: '3',
    metadata: {
      createdTime: 2021,
      data: {
        name: 'C',
      },
    },
  },
] as unknown as NftItem[];

afterEach(cleanup);

const defaultProps: ComponentProps<typeof CollectionItemList> = {
  nftCollection: {
    chain: {},
    id: 'REVV',
    contractAddress: constants.AddressZero,
    externalLinks: {
      opensea: 'https://opensea.io/collection/revv-motorsport-inventory',
    },
  } as unknown as TransformedNftCollection,
};

it('should render items by createTime DESC by default', () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: mockNftItems, isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByTestId('item-grid').textContent).toBe('BCA');
});

it('should render items correctly when A-Z is selected', async () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: mockNftItems, isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  fireEvent.mouseDown((await screen.getAllByRole('button'))[0]);
  const listbox = within(screen.getByRole('listbox'));
  fireEvent.click(listbox.getByText('A-Z'));
  expect(screen.getByTestId('item-grid').textContent).toBe('ABC');
});

it('should render items correctly when Z-A is selected', async () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: mockNftItems, isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  fireEvent.mouseDown((await screen.getAllByRole('button'))[0]);
  const listbox = within(screen.getByRole('listbox'));
  fireEvent.click(listbox.getByText('Z-A'));
  expect(screen.getByTestId('item-grid').textContent).toBe('CBA');
});

it('should call navigate when an item is clicked', () => {
  const mockNavigate = jest.fn();
  mockedUseNavigate.mockReturnValue(mockNavigate as unknown as any);
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: mockNftItems, isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText('A'));
  expect(mockNavigate).toHaveBeenCalled();
});

it('should render empty state when the user has no items', () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: [], isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByTestId('empty-state')).toBeInTheDocument();
});

it('should not render the filter dropdown when the user has no items', () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: [], isLoading: false });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });

  const header = screen.getByTestId('collection-list-header');
  expect(header.childElementCount).toEqual(1);
});

it('should render skeletons when isLoading is true', () => {
  mockedUseNftCollectionItems.mockReturnValue({ nftCollectionItems: [], isLoading: true });
  render(<CollectionItemList {...defaultProps} />, { wrapper: TestProviders });
  expect(screen.getByTestId('skeleton-item-grid')).toBeInTheDocument();
});
