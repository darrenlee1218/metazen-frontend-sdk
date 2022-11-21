import {
  BuiltTx,
  ContractTransfer,
  NativeBuildParams,
  ContractBuildParams,
  ContractTransferFrom,
  ContractSafeTransferFrom,
  ContractBuiltFunctionSignature,
} from './types/v2Api';
import { txbuilderClient } from '.';

export const buildNativeTransaction = async (params: NativeBuildParams): Promise<BuiltTx> => {
  const { chainId, to, from, value, maxFeePerGas, maxPriorityFeePerGas } = params;
  const builtTx = <BuiltTx>await txbuilderClient.request('mtz_txbuilder_nativeCall', [
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

export const buildContractTransaction =
  <T>(functionSignature: ContractBuiltFunctionSignature) =>
  async (params: ContractBuildParams<T>): Promise<BuiltTx> => {
    const { chainId, contractAddress, functionParams, from, maxFeePerGas, maxPriorityFeePerGas } = params;
    const builtTx = await txbuilderClient.request('mtz_txbuilder_contractCall', [
      chainId,
      contractAddress,
      functionSignature,
      functionParams,
      {
        from,
        maxFeePerGas,
        maxPriorityFeePerGas,
      },
    ]);
    return builtTx;
  };

export const buildContractTransferTransaction = buildContractTransaction<ContractTransfer>(
  ContractBuiltFunctionSignature.transfer,
);

export const buildContractTransferFromTransaction = buildContractTransaction<ContractTransferFrom>(
  ContractBuiltFunctionSignature.transferFrom,
);

export const buildContractSafeTransferFromERC721Transaction = buildContractTransaction<ContractSafeTransferFrom>(
  ContractBuiltFunctionSignature.safeTransferFrom_ERC721,
);

export const buildContractSafeTransferFromERC1155Transaction = buildContractTransaction<ContractSafeTransferFrom>(
  ContractBuiltFunctionSignature.safeTransferFrom_ERC1155,
);
