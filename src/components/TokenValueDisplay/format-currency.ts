import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import BigNumber from 'bignumber.js';

export interface FormatCurrencyParams {
  token: Pick<Token, 'standard' | 'decimal'>;
  /**
   * Balance must be in asset's decimals
   * If not provided, will default to 10 ** token.decimal
   */
  amount?: string;

  pricePerAssetInUsd: string;

  precision?: number;

  currencyDisplay?: string;
}

export const formatCurrency = ({
  token,
  amount,
  pricePerAssetInUsd,
  precision = 2,
  currencyDisplay = '$',
}: FormatCurrencyParams): string => {
  const { decimal: assetDecimals } = token;
  if (pricePerAssetInUsd == null) {
    console.error(`Price for token is nullish`);
    return '';
  }

  if (![TokenStandard.NATIVE, TokenStandard.ERC20].includes(token.standard) || assetDecimals == null) {
    throw new Error('Unsupported Token Standard / Missing assetDecimals');
  }

  const assetDecimalsBN = new BigNumber(10).pow(assetDecimals);
  const amountValueInUsd = new BigNumber(amount ?? assetDecimalsBN)
    .div(assetDecimalsBN)
    .multipliedBy(pricePerAssetInUsd);

  const requiredBalanceValueInUsd = new BigNumber(10).pow(-precision);

  BigNumber.config({ EXPONENTIAL_AT: [-precision - 1, 20] });

  if (amountValueInUsd.isGreaterThan(0) && amountValueInUsd.isLessThan(requiredBalanceValueInUsd)) {
    return ['<', currencyDisplay, requiredBalanceValueInUsd.toString()].join('');
  }

  return [currencyDisplay, amountValueInUsd.toFormat(precision, BigNumber.ROUND_DOWN)].join('');
};
