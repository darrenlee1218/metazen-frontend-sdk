import {
  LegacyBuiltTx,
  IApproveTxParams,
  IRegularTxParams,
  ITransferTxParams,
  ITransferFromTxParams,
  ISafeDeliverFromTxParams,
  ISafeTransferFromTxParams,
  ISafeBatchTransferFromTxParams,
} from './types/legacy';
import { txbuilderClient } from '.';

export const buildRegularTransaction = async (params: IRegularTxParams): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, maxFeePerGas, maxPriorityFeePerGas } = params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_regular', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildTransferTransaction = async (params: ITransferTxParams): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, symbol, erc, maxFeePerGas, maxPriorityFeePerGas } = params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_transfer', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildApproveTransaction = async (params: IApproveTxParams): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, symbol, erc, maxFeePerGas, maxPriorityFeePerGas } = params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_approve', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildTransferFromTransaction = async (params: ITransferFromTxParams): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, symbol, erc, maxFeePerGas, maxPriorityFeePerGas } = params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_transferFrom', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildSafeTransferFromTransaction = async (params: ISafeTransferFromTxParams): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, symbol, erc, tokenId, maxFeePerGas, maxPriorityFeePerGas } = params;

  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_safeTransferFrom', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      tokenId,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildSafeBatchTransferFromTransaction = async (
  params: ISafeBatchTransferFromTxParams,
): Promise<LegacyBuiltTx> => {
  const { ticker, chainId, to, from, value, symbol, erc, tokenIds, tokenValues, maxFeePerGas, maxPriorityFeePerGas } =
    params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_safeBatchTransferFrom', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      tokenIds,
      tokenValues,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};

export const buildSafeDeliverFromTransaction = async (params: ISafeDeliverFromTxParams): Promise<LegacyBuiltTx> => {
  const {
    ticker,
    chainId,
    to,
    from,
    value,
    symbol,
    erc,
    tokenIds,
    tokenValues,
    tos,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = params;
  const builtTx = <LegacyBuiltTx>await txbuilderClient.request('mtz_txbuilder_safeDeliverFrom', [
    ticker,
    chainId,
    {
      to,
      from,
      value,
      symbol,
      erc,
      tos,
      tokenIds,
      tokenValues,
      maxFeePerGas,
      maxPriorityFeePerGas,
    },
  ]);
  return builtTx;
};
