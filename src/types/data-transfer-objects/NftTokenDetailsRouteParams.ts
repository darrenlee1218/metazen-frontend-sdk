import Token from './Token';

interface NftTokenDetailsRouteParams {
  chainId: string;
  nftTokenId: string;
  contractAddress: string;
  sendNavRoute: string;
  address: string;
  chain: Token['chain'];
}

export default NftTokenDetailsRouteParams;
