import { constants } from 'ethers';
import React, { ComponentProps } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

import { AssetReceiveScreen, ReceiveVariant } from '.';
import { TestProviders } from '@utils/testing/TestProviders';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

afterEach(cleanup);

jest.mock('react-router-dom');

const defaultProps: ComponentProps<typeof AssetReceiveScreen> = {
  variant: ReceiveVariant.Nft,
  recipientAddress: constants.AddressZero,
  displayName: 'ASSET',
  chainName: 'Polygon (Mumbai)',
  networkIconUrl: 'networkIcon.png',
  onClose: () => {},
  onBackPress: () => {},
};

it('should return to the homepage after clicking on close', () => {
  const mockedOnClose = jest.fn();
  const props = { ...defaultProps, onClose: mockedOnClose };
  render(<AssetReceiveScreen {...props} />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText('Close'));
  expect(mockedOnClose).toHaveBeenCalled();
});

it('matches snapshot when variant is ReceiveVariant.Nft', () => {
  const { container } = render(<AssetReceiveScreen {...defaultProps} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});

it('matches snapshot when variant is ReceiveVariant.Token', () => {
  const props = {
    ...defaultProps,
    variant: ReceiveVariant.Token,
    balance: {
      token: {
        ticker: 'ASSET',
        standard: TokenStandard.ERC20,
        display: { svgIconUrl: 'icon.png' },
        decimal: 18,
        displayPrecision: 4,
        custodyPrecision: 8,
      },
      balanceInAssetDecimals: '10000000000000000000',
      price: '1',
    } as unknown as any,
  };
  const { container } = render(<AssetReceiveScreen {...props} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
