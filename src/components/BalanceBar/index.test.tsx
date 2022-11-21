import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';

import { BalanceBar } from '.';
import theme from '../../theme/theme';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

const testProps = {
  token: {
    ticker: 'MATIC',
    displayPrecision: 4,
    custodyPrecision: 8,
    decimal: 18,
    standard: TokenStandard.ERC20,
  },
  balanceInAssetDecimals: '900000000000000000000',
  price: '0.8718',
} as TokenBalance;

describe('BalanceBar', () => {
  it('renders all the required content given valid props', () => {
    const { baseElement } = render(
      <ThemeProvider theme={theme()}>
        <BalanceBar {...testProps} />
      </ThemeProvider>,
    );
    expect(baseElement).toMatchSnapshot();
  });
});
