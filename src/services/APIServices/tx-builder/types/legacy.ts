export interface LegacyBuiltTx {
  to: string;
  // Default value 2
  type: number;
  data: string;
  nonce: number;
  value: string;
  chainId: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface ILegacyBaseTxParams {
  to: string;
  from: string;
  value: string;
  ticker: string;
  chainId: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

// FIXME: An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-interface
export type IRegularTxParams = ILegacyBaseTxParams;

export interface ITransferTxParams extends ILegacyBaseTxParams {
  symbol?: string;
  erc?: string;
}

// FIXME: An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-interface
export type IApproveTxParams = ITransferTxParams;

// FIXME: An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-interface
export type ITransferFromTxParams = ITransferTxParams;

// FIXME: An interface declaring no members is equivalent to its supertype.eslint@typescript-eslint/no-empty-interface
export interface ISafeTransferFromTxParams extends ITransferTxParams {
  tokenId?: string;
}

export interface ISafeBatchTransferFromTxParams extends ITransferTxParams {
  tokenIds: string[];
  tokenValues: string[];
}

export interface ISafeDeliverFromTxParams extends ISafeBatchTransferFromTxParams {
  tos: string[];
}
