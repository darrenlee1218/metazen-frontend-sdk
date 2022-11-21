import { isAddress, isChainId } from '@gryfyn-types/data-transfer-objects/JrpcWalletAddress';

export const validations = (chainId: string, address: string, message: string) => {
  const errors: string[] = [];
  if (!isChainId(chainId)) {
    errors.push('Invalid chain id');
  }
  if (!isAddress(address)) {
    errors.push('Invalid address');
  }
  // restriction on sign message needs to be reviewed
  if (message === '') {
    errors.push('Empty Message cannot be signed');
  }
  return errors;
};
