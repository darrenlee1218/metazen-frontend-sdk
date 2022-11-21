import React from 'react';

import BarBox from '@components/BarBox';
import { boxCreator } from '@components/boxCreator';

import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';
import { TokenValueDisplay } from '@components/TokenValueDisplay';

const BalanceContent = boxCreator({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const BalanceBar: React.FC<TokenBalance> = ({ token, balanceInAssetDecimals, price }) => (
  <BarBox label="Balance">
    <BalanceContent>
      <TokenValueDisplay.Amount
        data-testid="balance-amount"
        token={token}
        amount={balanceInAssetDecimals}
        precision="custody"
        variant="h2"
        color="text.primary"
        fontWeight={600}
      />
      <TokenValueDisplay.Currency
        data-testid="balance-currency"
        token={token}
        amount={balanceInAssetDecimals}
        pricePerAssetInUsd={price!}
        variant="h4"
        color="text.secondary"
      />
    </BalanceContent>
  </BarBox>
);
