import React, { FC } from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { formatAmount, FormatAmountParams } from './format-amount';
import { formatCurrency, FormatCurrencyParams } from './format-currency';

interface AmountDisplayProps extends FormatAmountParams, TypographyProps {}

const AmountDisplay: FC<AmountDisplayProps> = ({ token, amount: balance, precision, ...props }) => {
  return (
    <Typography {...props} data-testid="amount-display">
      {formatAmount({ token, amount: balance, precision })}
    </Typography>
  );
};

interface CurrencyDisplayProps extends FormatCurrencyParams, TypographyProps {}

const CurrencyDisplay: FC<CurrencyDisplayProps> = ({
  token,
  amount: balance,
  pricePerAssetInUsd,
  precision,
  currencyDisplay,
  ...props
}) => {
  return (
    <Typography {...props} data-testid="currency-display">
      {formatCurrency({ token, amount: balance, pricePerAssetInUsd, precision, currencyDisplay })}
    </Typography>
  );
};

export const TokenValueDisplay = {
  Amount: AmountDisplay,
  Currency: CurrencyDisplay,
};
