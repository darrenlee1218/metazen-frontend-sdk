import Token from './Token';

export interface TransformedNftCollection {
  displayName: string;
  iconUrl: string;
  nftCollectionBackgroundImageUrl: string;
  nftPngImage: string;
  chain: Token['chain'];
  contractAddress: string;
  id: string;
  pngNetworkIconUrl: string;
  numUniqueItems: number | undefined;
  externalLinks: {
    website: string;
    twitter: string;
    opensea: string;
  };
}
