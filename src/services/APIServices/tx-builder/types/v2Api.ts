// We are using standard field name defined in
// https://eips.ethereum.org/EIPS/eip-721 and https://eips.ethereum.org/EIPS/eip-1155
// Somehow for REVVM contract the field name 'tokenId' is renamed to 'nftId'
export enum ContractBuiltFunctionSignature {
  transfer = 'transfer(address,uint256)',
  transferFrom = 'transferFrom(address,address,uint256)',
  safeTransferFrom_ERC721 = 'safeTransferFrom(address,address,uint256)', // from, to, tokenId
  // 'amount' field name is used in sunnies ABI and open zeppelin standard
  // while 'value' field is used in EIP official standard
  safeTransferFrom_ERC1155 = 'safeTransferFrom(address,address,uint256,uint256,bytes)', // from, to, id, amount / value, data
}

export interface BuiltTx {
  to: string;
  from: string;
  // Default value 2
  type: number;
  // Default value 0x0
  data: string;
  nonce: number;
  value: string;
  chainId: string;
  // Default value 0x5208
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
}

export interface NativeBuildParams {
  to: string;
  from: string;
  value: string; // HexNumber
  chainId: string;
  gasPrice?: string; // HexNumber
  maxFeePerGas?: string; // HexNumber
  maxPriorityFeePerGas?: string; // HexNumber
}

export interface ContractBuildParams<T> {
  from: string;
  chainId: string;
  functionParams: T;
  contractAddress: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
}

export interface ContractTransfer {
  to: string;
  value: string;
  dst?: string; // Used by wMATIC
  wad?: string; // Used by wMATIC
  amount?: string; // Used by wETH
  recipient?: string; // Used by wETH
}

export interface ContractTransferFrom {
  to: string;
  from: string;
  value: string;
}

export interface ContractSafeTransferFrom {
  to: string;
  from: string;
  id?: string;
  data?: string;
  value?: string; // EIP official standard (https://eips.ethereum.org/EIPS/eip-1155)
  amount?: string; // Open Zeppelin (https://docs.openzeppelin.com/contracts/3.x/api/token/erc1155#IERC1155-safeTransferFrom-address-address-uint256-uint256-bytes-)
  tokenId?: string;
}
