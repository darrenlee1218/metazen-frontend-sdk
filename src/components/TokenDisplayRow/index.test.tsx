import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { ComponentProps } from 'react';
import { TokenDisplayRow } from '.';
import { TestProviders } from '@utils/testing/TestProviders';
import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

afterEach(cleanup);

const defaultProps: ComponentProps<typeof TokenDisplayRow> = {
  token: {
    isNative: false,
    displayName: 'Polygon (Mainnet)',
    network: {
      pngNetworkIconUrl: 'network.png',
    },
    display: {
      pngIconUrl: 'icon.png',
      svgIconUrl: 'icon.svg',
    },
    ticker: 'MATIC',
    displayPrecision: 4,
    custodyPrecision: 8,
    decimal: 18,
    standard: TokenStandard.ERC20,
  } as unknown as Token,
  price: '1',
  balanceInAssetDecimals: '10000000000000000000',
};

it('calls the callback after a click event', () => {
  const callback = jest.fn();
  const props = { ...defaultProps, onClick: callback };
  render(<TokenDisplayRow {...props} />, { wrapper: TestProviders });
  fireEvent.click(screen.getByText(defaultProps.token.displayName));
  expect(callback).toHaveBeenCalled();
});

it('does not render prices if price / amountUsdValue is falsey', () => {
  const props = { ...defaultProps, price: '', amountUsdValue: undefined };
  render(<TokenDisplayRow {...props} />, { wrapper: TestProviders });
  expect(screen.queryByTestId('prices-row')).toBe(null);
});

it('matches snapshot', () => {
  const { container } = render(<TokenDisplayRow {...defaultProps} />, { wrapper: TestProviders });
  expect(container).toMatchSnapshot();
});
