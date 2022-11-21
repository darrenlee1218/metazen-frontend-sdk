import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import BigNumber from 'bignumber.js';

export interface FormatAmountParams {
  token: Pick<Token, 'standard' | 'decimal' | 'displayPrecision' | 'custodyPrecision' | 'ticker'>;
  /**
   * Amount must be in asset's decimals
   */
  amount: string;
  precision: 'display' | 'custody';
}

export const formatAmount = ({ token, amount: amountInAssetDecimals, precision }: FormatAmountParams): string => {
  const { decimal: assetDecimals, displayPrecision, custodyPrecision } = token;

  if (![TokenStandard.NATIVE, TokenStandard.ERC20].includes(token.standard)) {
    return amountInAssetDecimals;
  }

  if (assetDecimals == null || displayPrecision == null || custodyPrecision == null) {
    throw new Error('Missing assetDecimals / displayPrecision / custodyPrecision in object');
  }

  const amountBn = new BigNumber(amountInAssetDecimals);
  if (amountBn.isEqualTo(0)) {
    return ['0', token.ticker].join(' ');
  }

  const precisionDecimals = precision === 'custody' ? custodyPrecision : displayPrecision;
  const assetDecimalsBN = new BigNumber(10).pow(assetDecimals);
  const requiredAmountBn = new BigNumber(10).pow(assetDecimals - precisionDecimals);

  BigNumber.config({ EXPONENTIAL_AT: [-precisionDecimals - 1, 20] });

  if (amountBn.isLessThan(requiredAmountBn)) {
    return `<${requiredAmountBn.div(assetDecimalsBN).toString()} ${token.ticker}`;
  } else {
    return [
      new BigNumber(amountBn.div(assetDecimalsBN).toFixed(precisionDecimals, BigNumber.ROUND_DOWN)).toFormat(),
      token.ticker,
    ].join(' ');
  }
};
