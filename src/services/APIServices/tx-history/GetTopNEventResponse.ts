interface ERC20 {
  tokenTransferred: string;
  decimal: number;
  assetKey: string;
  assetSymbol: string;
}

interface ERC721 {
  assetKey: string;
  assetSymbol: string;
  owner: string;
  tokenID: string;
  tokenURI: string;
  contractAddress: string;
}

interface ERC1155 {
  assetKey: string;
  assetSymbol: string;
  tokenID: string;
  contractAddress: string;
  tokenTransferred: string;
  data: string;
}

export interface GetTopNTransactionsResponse {
  from: string;
  to: string;
  hash: string;
  createdAt: string;
  transactionType: string;
  status: string;
  value: string;
  assetTicker: string;
  relevantAddress: string[];
  actionAddress: string;
  chainId: string;
  spec: string;
  contractAddress: string;
  erc20?: ERC20;
  erc721?: ERC721;
  erc1155?: ERC1155;
  primaryTransactionStatus: string;
  secondaryTransactionStatus: string;
  id: string;
}
