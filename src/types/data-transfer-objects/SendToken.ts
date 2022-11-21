import { TokenStandard } from './Token';

// The internal standard of token used in token withdrawal flow
// i.e. SendPage and SendConfirmationPage
export default interface SendToken {
  assetKey: string;
  icon: string;
  ticker: string;
  symbol?: string;
  chainId: string;
  gasLimit: string;
  network?: string;
  provider?: string;
  tokenName: string;
  chainName: string;
  maxAmount: string;
  networkIcon: string;
  fromAddress: string;
  standard: TokenStandard;
  tokenAssetTicker: string;
  contractAddress?: string;
  decimals: number | string;
  displayPrecision?: number;
  custodyPrecision?: number;
}
