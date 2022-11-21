export interface FeeJsonPath {
  maxPriorityFeePerGas: string;
  maxFeePerGas?: string;
  baseFeePerGas?: string;
}

export interface GasFee {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface PricesJsonPath {
  low: FeeJsonPath;
  standard: FeeJsonPath;
  fast: FeeJsonPath;
}

export interface Prices {
  low: GasFee;
  standard: GasFee;
  fast: GasFee;
}

export type JsonPath = PricesJsonPath & { blockNumber: string };

export interface PriceOracle {
  url: string;
  jsonPath: JsonPath;
  maxBlockDifference: number;
}

export enum UserActionOnTx {
  SpeedUp = 'SpeedUp',
  Cancel = 'Cancel',
}
