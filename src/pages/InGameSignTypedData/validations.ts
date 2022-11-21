import { EIP712TypedData } from '@gryfyn-types/data-transfer-objects/EIP712TypedData';
import { isAddress, isChainId } from '@gryfyn-types/data-transfer-objects/JrpcWalletAddress';

export const validations = (chainId: string, address: string, typedData: EIP712TypedData) => {
  const errors: string[] = [];
  if (!isChainId(chainId)) {
    errors.push('Invalid chain id');
  }
  if (!isAddress(address)) {
    errors.push('Invalid address');
  }
  // TODO: restriction on sign typed data needs to be reviewed
  return errors;
};
