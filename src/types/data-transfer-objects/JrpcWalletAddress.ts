export type Address = string & { readonly Address: unique symbol };
export type HexNumber = string & { readonly HexNumber: unique symbol };
export type ChainId = string & { readonly ChainId: unique symbol };

export const isAddress = (str: string): str is Address => /^0x[0-9a-fA-F]{40}$/.test(str);
export const isChainId = (str: string): str is ChainId => /^[0-9]+$/.test(str);

export interface JrpcWalletAddress {
  address: Address;
  chain_id: ChainId;
}
