import { BigNumber } from 'ethers';
import { getJsonValue } from '@utils/general';
import nodeProvider from '@services/provider/node';

import { gweiPriceToHexString } from './utils';
import { PriceOracle, GasFee, Prices, UserActionOnTx } from './types/fee';
import { CachedJsonRpcProviders } from '@lib/ethers/cached-providers';

const REACT_APP_ETHER_SCAN_APIKEY = process.env.REACT_APP_ETHER_SCAN_APIKEY;

// use this price cache if we can't get the new price from node provider due to errors like rate limit exceeded
const priceFromChainCache: GasFee = {
  maxFeePerGas: '0x0',
  maxPriorityFeePerGas: '0x0',
};

// if maxFeePerGas path not defined, baseFeePerGas path must be defined
const gasPriceOracle: { [chainId: string]: PriceOracle | undefined } = {
  '1': {
    url: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${REACT_APP_ETHER_SCAN_APIKEY}`,
    maxBlockDifference: 5,
    jsonPath: {
      blockNumber: 'result.LastBlock',
      low: {
        maxPriorityFeePerGas: 'result.SafeGasPrice',
        maxFeePerGas: 'result.SafeGasPrice',
        baseFeePerGas: 'result.suggestBaseFee',
      },
      standard: {
        maxPriorityFeePerGas: 'result.ProposeGasPrice',
        maxFeePerGas: 'result.ProposeGasPrice',
        baseFeePerGas: 'result.suggestBaseFee',
      },
      fast: {
        maxPriorityFeePerGas: 'result.FastGasPrice',
        maxFeePerGas: 'result.FastGasPrice',
        baseFeePerGas: 'result.suggestBaseFee',
      },
    },
  },
  '137': {
    url: 'https://gasstation-mainnet.matic.network/v2',
    maxBlockDifference: 5,
    jsonPath: {
      blockNumber: 'blockNumber',
      low: { maxPriorityFeePerGas: 'safeLow.maxPriorityFee', maxFeePerGas: 'safeLow.maxFee' },
      standard: { maxPriorityFeePerGas: 'standard.maxPriorityFee', maxFeePerGas: 'standard.maxFee' },
      fast: { maxPriorityFeePerGas: 'fast.maxPriorityFee', maxFeePerGas: 'fast.maxFee' },
    },
  },
  '80001': {
    url: 'https://gasstation-mumbai.matic.today/v2',
    maxBlockDifference: 5,
    jsonPath: {
      blockNumber: 'blockNumber',
      low: { maxPriorityFeePerGas: 'safeLow.maxPriorityFee', maxFeePerGas: 'safeLow.maxFee' },
      standard: { maxPriorityFeePerGas: 'standard.maxPriorityFee', maxFeePerGas: 'standard.maxFee' },
      fast: { maxPriorityFeePerGas: 'fast.maxPriorityFee', maxFeePerGas: 'fast.maxFee' },
    },
  },
};

export const getGasPrice = async (
  chainID: string | number,
  currentPrice?: GasFee,
  action?: UserActionOnTx,
): Promise<GasFee> => {
  if (!chainID) {
    throw new Error(`can't get gas price from undefined chain id`);
  }
  if (!Object.keys(nodeProvider).includes(`${chainID}`)) {
    throw new Error(`chain id not supported: ${chainID}`);
  }
  if (currentPrice) {
    if (!action) return currentPrice;
    return getGasPriceWithCurrentPrice(chainID, currentPrice, action);
  }
  return getGasPriceFirstTime(chainID);
};

const getGasPriceFirstTime = async (chainID: string | number): Promise<GasFee> => {
  try {
    const { standard } = await getGasPriceFromOracle(chainID);
    return standard;
  } catch (error) {
    console.log('getGasPriceFromOracle error:', error);
    return getGasPriceFromChain(chainID);
  }
};

const getGasPriceWithCurrentPrice = async (
  chainID: string | number,
  currentPrice: GasFee,
  action: UserActionOnTx,
): Promise<GasFee> => {
  const newGasFee: GasFee = {
    maxFeePerGas: currentPrice.maxFeePerGas,
    maxPriorityFeePerGas: currentPrice.maxPriorityFeePerGas,
  };
  try {
    const { standard, fast } = await getGasPriceFromOracle(chainID);
    for (const [key, currentFee] of Object.entries(currentPrice)) {
      const high = fast[key as keyof GasFee];
      const avg = standard[key as keyof GasFee];
      let newFee: string;
      switch (action) {
        case UserActionOnTx.SpeedUp:
          if (currentFee > high) {
            newFee = BigNumber.from(currentFee).mul(110).div(100).toHexString();
          } else if (currentFee >= avg) {
            newFee = high;
          } else {
            newFee = avg;
          }
          break;
        case UserActionOnTx.Cancel:
          if (currentFee >= high) {
            newFee = BigNumber.from(currentFee).mul(110).div(100).toHexString();
          } else {
            newFee = high;
          }
          break;
      }
      newGasFee[key as keyof GasFee] = newFee;
    }
    return newGasFee;
  } catch (error) {
    console.log('getGasPriceFromOracle error:', error);
    const chainPrice = await getGasPriceFromChain(chainID);
    for (const [key, currentFee] of Object.entries(currentPrice)) {
      const chainFee = chainPrice[key as keyof GasFee];
      let newFee: string;
      if (currentFee >= chainFee) {
        newFee = BigNumber.from(currentFee).mul(110).div(100).toHexString();
      } else {
        newFee = chainFee;
      }
      newGasFee[key as keyof GasFee] = newFee;
    }
    return newGasFee;
  }
};

const getGasPriceFromChain = async (chainID: string | number): Promise<GasFee> => {
  // eip1559
  // get the latest fee data, pick the highest one for max fee
  // and pick the highest one and multiple by 12.5% for max priorty fee
  const providerUrl = nodeProvider[chainID];
  if (!providerUrl) {
    throw new Error(`can't get gas price from chain with undefined provider url`);
  }
  const jsonRpcProvider = CachedJsonRpcProviders.getInstance({
    url: providerUrl,
    throttleLimit: 1,
    throttleCallback: async () => false,
  });
  try {
    const feeData = await jsonRpcProvider.getFeeData();
    priceFromChainCache.maxFeePerGas = feeData.maxFeePerGas?.toHexString() ?? priceFromChainCache.maxFeePerGas;
    priceFromChainCache.maxPriorityFeePerGas =
      feeData.maxPriorityFeePerGas?.toHexString() ?? priceFromChainCache.maxPriorityFeePerGas;
    return {
      maxFeePerGas: feeData.maxFeePerGas?.toHexString() ?? '0x0',
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toHexString() ?? '0x0',
    };
  } catch (error) {
    console.log(`getGasPriceFromChain: ${error}`);
    return priceFromChainCache;
  }
};

const getGasPriceFromOracle = async (chainID: string | number): Promise<Prices> => {
  const oracle = gasPriceOracle[chainID];
  if (!oracle) throw new Error(`chainID: ${chainID} not supported for oracle prices`);
  const oracleUrl = oracle.url;
  const res = await fetch(oracleUrl);
  const jsonRes = await res.json();

  // Should not use the price from oracle if block number difference is too big
  const blockNumber = getJsonValue(jsonRes, oracle.jsonPath.blockNumber);
  const maxBlockDifference = oracle.maxBlockDifference;
  const providerUrl = nodeProvider[chainID];
  if (!providerUrl) {
    throw new Error(`can't get gas price from chain with undefined provider url`);
  }
  const jsonRpcProvider = CachedJsonRpcProviders.getInstance({
    url: providerUrl,
    throttleLimit: 1,
    throttleCallback: async () => false,
  });
  const blockNumberOnChain = await jsonRpcProvider.getBlockNumber();
  if (blockNumberOnChain - Number(blockNumber) >= maxBlockDifference) {
    throw new Error(`block number difference is too big, should not use the price from this oracle`);
  }

  const jsonPath = oracle.jsonPath;
  const priceArray: Prices = {
    low: {
      maxFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.low.maxFeePerGas)),
      maxPriorityFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.low.maxPriorityFeePerGas)),
    },
    standard: {
      maxFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.standard.maxFeePerGas)),
      maxPriorityFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.standard.maxPriorityFeePerGas)),
    },
    fast: {
      maxFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.fast.maxFeePerGas)),
      maxPriorityFeePerGas: gweiPriceToHexString(getJsonValue(jsonRes, jsonPath.fast.maxPriorityFeePerGas)),
    },
  };
  return priceArray;
};
