import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NftTokenData from '@gryfyn-types/data-transfer-objects/NftTokenData';
import { NftTokenTile } from '../NftTokenTile';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@theme/theme';

const mockNftToken = {} as unknown as NftTokenData;

jest.mock('@redux/api/assetMetadataCache', () => ({
  __esModule: true,
  useGetAssetMetadataQuery: () => ({
    data: {
      data: {
        name: 'Nft Name',
        image: '404.png',
      },
    },
    isLoading: false,
  }),
}));

describe('NftTokenTile', () => {
  it('should render correctly', () => {
    const handleClick = jest.fn();
    const baseDom = render(
      <ThemeProvider theme={defaultTheme()}>
        <NftTokenTile isSelected collectionContractAddress="" nftToken={mockNftToken} onClick={handleClick} />
      </ThemeProvider>,
    );
    expect(baseDom.baseElement).toMatchSnapshot();
  });

  it('should call the clickHandler on user click', () => {
    const handleClick = jest.fn();
    const baseDom = render(
      <ThemeProvider theme={defaultTheme()}>
        <NftTokenTile isSelected collectionContractAddress="" nftToken={mockNftToken} onClick={handleClick} />
      </ThemeProvider>,
    );
    fireEvent.click(baseDom.getByText('Nft Name'));
    expect(handleClick).toHaveBeenCalled();
  });
});
