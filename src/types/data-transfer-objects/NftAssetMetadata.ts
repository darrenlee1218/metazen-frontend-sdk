import { NftCoreData } from './NftCoreData';

interface NftAssetMetadata {
  symbol: string;
  chainId: string;
  contractAddress: string;
  owner: string;
  tokenId: string;
  tokenStandard: string;
  createdTime: string;
  updatedTime: string;
  data: NftCoreData;
}

export default NftAssetMetadata;
