import React from 'react';
import { render } from '@testing-library/react';
import { SendGameCollection } from '..';
import { ThemeProvider } from '@mui/material/styles';
import defaultTheme from '@theme/theme';

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

jest.mock('@hooks/useTokenByKey', () => ({
  __esModule: true,
  useTokenByKey: () => ({
    contractAddress: '0x0000000000000000000000000000000000000000',
  }),
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: () => ({
    search: '',
  }),
  useParams: () => ({
    key: '',
  }),
  useNavigate: () => () => {},
}));

const expectedItems = 6;
const mockedBalancesData = Array.from({ length: expectedItems }).map((_, index) => ({
  nftTokenId: index,
}));
jest.mock('@redux/api/bookKeeping', () => ({
  __esModule: true,
  useGetBalancesByAssetIdsQuery: () => ({
    data: mockedBalancesData,
    isLoading: false,
  }),
}));

describe('Send Game Collection', () => {
  it('should render correctly', () => {
    const baseDom = render(
      <ThemeProvider theme={defaultTheme()}>
        <SendGameCollection />
      </ThemeProvider>,
    );
    expect(baseDom.baseElement).toMatchSnapshot();
  });

  it('should render the correct number of nft items', () => {
    const baseDom = render(
      <ThemeProvider theme={defaultTheme()}>
        <SendGameCollection />
      </ThemeProvider>,
    );
    expect(baseDom.getAllByText('Nft Name')).toHaveLength(expectedItems);
  });
});
