import { utils } from 'ethers';
import BigNumber from 'bignumber.js';

import SendToken from '@gryfyn-types/data-transfer-objects/SendToken';
import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';

import { NUMBER_WITH_TRAILING_ZEROES, VALID_INPUT_AMOUNT } from './regex';
import {
  ContractSafeTransferFrom,
  ContractTransfer,
  REVV_CONTRACT,
  USDC_CONTRACT,
  WETH_CONTRACTS,
  WMATIC_CONTRACTS,
} from './types';

export interface TokenBalance {
  address: string;
  balance: string;
}

export const countDecimalPlaces = (num: string) => {
  const index = num.indexOf('.');
  return !num.includes('.') ? 0 : num.length - index - 1;
};

export const gweiPriceToHexString = (price: number | string): string =>
  utils.parseUnits(`${Number(price).toFixed(8)}`, 'gwei').toHexString();

// 'input' param is expecting React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>.target.value of type any natively
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatAmountInputOnChange = (input: any, amountChanged: (...event: any[]) => void, token?: SendToken) => {
  if (input === '' || input.slice(-1) === '.' || isNaN(input)) {
    amountChanged(input);
  } else {
    const amountBN = new BigNumber(input);
    const amountDecimalPlaces = countDecimalPlaces(input);
    const maximumDecimalPlaces = token?.custodyPrecision ?? 8;

    if (amountDecimalPlaces <= maximumDecimalPlaces) {
      amountChanged(input);
      return;
    }
    if (amountBN.isEqualTo(0) && amountDecimalPlaces > maximumDecimalPlaces) {
      amountChanged(`0.${'0'.repeat(maximumDecimalPlaces)}`);
    }
  }
};

export const checkNonZeroInput = (inputAmount: string): boolean => {
  return VALID_INPUT_AMOUNT.test(inputAmount) && new BigNumber(inputAmount).isGreaterThan(0);
};

export const checkEnoughBalance = (
  inputAmount: string,
  token?: SendToken,
  gasPrice?: string,
  gasPayer?: SendToken,
): { token: boolean; fee: boolean } => {
  // Always return true if inputAmount is not valid, we will leave react-form to handle invalid inputAmount error message
  const estimatedNetworkFee = new BigNumber(gasPrice ?? '0x0', 16).multipliedBy(
    new BigNumber(gasPayer?.gasLimit ?? '0x0', 16),
  );
  const availableGasPayerBalance = new BigNumber(gasPayer?.maxAmount ?? '0').minus(estimatedNetworkFee);
  const isEnoughFee = availableGasPayerBalance.isGreaterThanOrEqualTo(0);

  if (VALID_INPUT_AMOUNT.test(inputAmount)) {
    // Native token
    if (typeof token !== 'undefined' && token.standard === TokenStandard.NATIVE) {
      const actualSendAmount = new BigNumber(inputAmount).multipliedBy(new BigNumber(10).pow(gasPayer?.decimals ?? 0));
      const isEnough = availableGasPayerBalance.minus(actualSendAmount).isGreaterThanOrEqualTo(0);
      return { token: isEnough, fee: isEnough };
    }
    // Non-native token
    return {
      token: new BigNumber(inputAmount)
        .multipliedBy(new BigNumber(10).pow(token?.decimals ?? 0))
        .isLessThanOrEqualTo(new BigNumber(token?.maxAmount ?? '0')),
      fee: availableGasPayerBalance.isGreaterThanOrEqualTo(0),
    };
  }
  return { token: true, fee: isEnoughFee };
};

export const checkEnoughAvailableBalance = (inputAmount: string, token?: SendToken): boolean => {
  if (VALID_INPUT_AMOUNT.test(inputAmount)) {
    const sendAmount = new BigNumber(inputAmount).multipliedBy(new BigNumber(10).pow(token?.decimals ?? 0));
    return sendAmount.isLessThanOrEqualTo(new BigNumber(token?.maxAmount ?? '0'));
  }
  return true;
};

export const getReadableFee = (
  gasLimit: string,
  gasPrice: string,
  gasPayer?: { decimals?: string | number; ticker?: string } | null,
): string => {
  const gasFee = new BigNumber(gasPrice);
  const gasEstimateBN = gasFee.multipliedBy(new BigNumber(gasLimit));
  const gasEstimateFormat = gasEstimateBN
    .dividedBy(new BigNumber(10).pow(new BigNumber(gasPayer?.decimals ?? 0)))
    .toFormat(8, BigNumber.ROUND_DOWN);
  return gasEstimateFormat;
};

export const getMaximumAvailableBalance = (token?: SendToken): string => {
  if (typeof token !== 'undefined') {
    const tokenDecimals = parseInt(String(token.decimals), 10);
    const finalDecimalPlaces = tokenDecimals > 8 ? 8 : tokenDecimals;
    return new BigNumber(token.maxAmount)
      .dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
      .toFormat(finalDecimalPlaces, BigNumber.ROUND_DOWN)
      .replace(NUMBER_WITH_TRAILING_ZEROES, '$1');
  }
  return '0';
};

export const getMaximumAvailableSendBalance = (
  gasLimit: string,
  gasPrice: string,
  token?: SendToken,
  gasPayer?: SendToken,
): string => {
  if (typeof token !== 'undefined' && typeof gasPayer !== 'undefined') {
    const tokenDecimals = parseInt(String(token.decimals), 10);
    const finalDecimalPlaces = tokenDecimals > 8 ? 8 : tokenDecimals;
    // Native token maximum balance will be maxAmount - network fee
    if (token.standard === TokenStandard.NATIVE) {
      const gasFee = new BigNumber(gasPrice);
      const gasEstimateBN = gasFee.multipliedBy(new BigNumber(gasLimit));
      const maximumAmount = new BigNumber(token.maxAmount)
        .minus(gasEstimateBN)
        .dividedBy(new BigNumber(10).pow(new BigNumber(gasPayer.decimals)))
        .toFormat(finalDecimalPlaces, BigNumber.ROUND_DOWN)
        .replace(NUMBER_WITH_TRAILING_ZEROES, '$1');
      return maximumAmount;
    }
    // Non-native token can use up maximum amount
    return new BigNumber(token.maxAmount)
      .dividedBy(new BigNumber(10).pow(new BigNumber(token.decimals)))
      .toFixed(finalDecimalPlaces, BigNumber.ROUND_DOWN)
      .replace(NUMBER_WITH_TRAILING_ZEROES, '$1');
  }
  return '0';
};

export const constructSendToken = (
  inputToken: Token,
  nativeToken: Token,
  balances: TokenBalance[],
  providerUrl: string,
): SendToken => {
  const {
    key,
    ticker,
    decimal,
    standard,
    gasLimit,
    contractAddress,
    displayPrecision,
    custodyPrecision,
    displayName: tokenName,
    display: { svgIconUrl },
    chain: { chainName, chainID: chainId },
    network: { pngNetworkIconUrl },
  } = inputToken;

  return {
    assetKey: key,
    chainId,
    standard,
    gasLimit,
    chainName,
    tokenName,
    fromAddress: balances.length === 0 ? '' : balances[0].address,
    symbol: ticker,
    contractAddress,
    displayPrecision,
    custodyPrecision,
    icon: svgIconUrl,
    maxAmount: balances.length === 0 ? '0' : balances[0].balance,
    provider: providerUrl,
    decimals: `${decimal}`,
    tokenAssetTicker: ticker,
    // asset ticker that used for pay gas fee
    ticker: nativeToken.ticker,
    networkIcon: pngNetworkIconUrl,
  };
};

export const getFunctionParams = (token: SendToken, input: ContractTransfer | ContractSafeTransferFrom) => {
  if (
    token.standard === TokenStandard.ERC20 &&
    [...WETH_CONTRACTS, REVV_CONTRACT, USDC_CONTRACT].includes(token.assetKey)
  ) {
    const { to, value } = input as ContractTransfer;
    return {
      recipient: to,
      amount: value,
    };
  }

  if (token.standard === TokenStandard.ERC20 && WMATIC_CONTRACTS.includes(token.assetKey)) {
    const { to, value } = input as ContractTransfer;
    return {
      dst: to,
      wad: value,
    };
  }

  return input;
};
