interface TokenDisplay {
  /**
   * specific color for display in some places
   */
  colorCode: string;

  /**
   * URL of token icon
   */
  pngIconUrl: string;

  /**
   * URL of token icon
   */
  svgIconUrl: string;

  /**
   * NFT collection icon
   */
  nftCollectionImageUrl?: string;

  /**
   * background image for the NFT collection
   */
  nftCollectionBackgroundImageUrl?: string;
}

interface TokenChain {
  /**
   * unique chain ID
   */
  chainID: string;

  /**
   * name of the chain
   */
  chainName: string;

  /**
   * whether it's a testnet/mainnet chain
   */
  type: 'TESTNET' | 'MAINNET';

  /**
   * minimum block confirmatoin required for a transaction
   */
  minBlockConfirmation: number;

  /**
   * Smart contract URL
   */
  smartContractUrl: string;

  /**
   * Address URL (for reviewing wallet info)
   */
  addressUrl: string;

  /**
   * tx URL (for reviewing address history)
   */
  txUrl: string;
}

interface TokenNetwork {
  /**
   * network name for chainalysis usage
   */
  chainalysisNetwork: string;

  /**
   * color display for the network
   */
  networkColor: string;

  /**
   * URL of network icon
   */
  pngNetworkIconUrl: string;
}

// TODO: set Token['standard] = TokenStandard
export enum TokenStandard {
  NATIVE = 'NATIVE',
  ERC20 = 'ERC-20',
  ERC721 = 'ERC-721',
  ERC1155 = 'ERC-1155',
}

export default interface Token {
  /**
   * unique token ID, from chain ID, ticker and contract address (contract addr only for non-native token)
   */
  key: string;

  /**
   * token name
   */
  displayName: string;

  /**
   * asset ticker
   * WARNING: ticker may be not unique
   */
  ticker: string;

  /**
   * standard of an token (e.g. ERC-1155)
   * always empty for native token
   */
  standard: TokenStandard;

  /**
   * whether it is a native token
   */
  isNative: boolean;

  /**
   * token's Explorer address i.e.polygonscan
   */
  txUrl: string;

  /**
   * token's contract address
   * undefined for native token
   */
  contractAddress: string | undefined;

  /**
   * gas limit of token for estimate gas fee
   */
  gasLimit: string;

  /**
   * decimal place for token amount
   */
  decimal?: number;

  /**
   * network related stuff
   */
  network: TokenNetwork;

  /**
   * decimal places for custody
   * defined for all ERC-20 / Native tokens
   */
  custodyPrecision?: number;

  /**
   * decimal places for display
   * defined for all ERC-20 / Native tokens
   */
  displayPrecision?: number;
  /**
   * display-related properties of an token
   */
  display: TokenDisplay;

  /**
   * chain info
   */
  chain: TokenChain;
}
