/**
 * @address address of current wallet
 * @assetId chainId_ticker_0x${contractAddress.substring(0, 8)}
 * @nftTokenId tokenId in the ERC721 / ERC1155 contract
 * @assetTicker deprecated
 */
interface NftTokenData {
  entityId: string;
  chainId: string;
  address: string;
  balance: string;
  assetId: string;
  nftTokenId: string;
  assetTicker: string;
}

export default NftTokenData;
