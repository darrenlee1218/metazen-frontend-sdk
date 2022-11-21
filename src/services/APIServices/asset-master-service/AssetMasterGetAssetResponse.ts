interface AssetMasterMetadata {
  display: {
    colorCode: string;
    pngIconUrl: string;
    svgIconUrl: string;
    nftCollectionImageUrl?: string;
    nftCollectionBackgroundImageUrl?: string;
  };
  ticker: string;
}

interface BaseAssetMasterTokenResponse {
  decimal: number;
  displayName: string;
  gasLimit: string; // Hex Number
  key: string;
  standard?: string; // Undefined if native token
  contractAddress?: string; // Undefined if native token
  custodyPrecision: number;
  displayPrecision: number;
}

interface NativeToken extends BaseAssetMasterTokenResponse, AssetMasterMetadata {}

interface NonNativeToken extends BaseAssetMasterTokenResponse {
  metadata: AssetMasterMetadata;
}

interface AssetMasterNetworkMetadata {
  chainalysisNetwork: string;
  networkColor: string;
  pngNetworkIconUrl: string;
}

export interface AssetMasterGetAssetResponse {
  version: string;
  data: {
    [chainID: string]: {
      chainName: string;
      chainID: string;
      type: 'TESTNET' | 'MAINNET';
      minBlockConfirmation: number;
      smartContractUrl: string;
      addressUrl: string;
      txUrl: string;
      network: AssetMasterNetworkMetadata;
      native: NativeToken;
      tokens: Record<string, NonNativeToken>;
    };
  };
}
