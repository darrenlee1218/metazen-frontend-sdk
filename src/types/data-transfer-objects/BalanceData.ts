interface BalanceData {
  /**
   * unique entitiy ID
   */
  entityId: string;

  /**
   * chain ID for that asset
   */
  chainId: string;

  /**
   * from address
   */
  address: string;

  /**
   * balance of the asset
   */
  balance: string;

  /**
   * @deprecated
   * will be removed, use assetId instead
   */
  assetTicker: string;

  /**
   * key to identify asset in asset-master-service data
   */
  assetId: string;

  /**
   * ID for a NFT
   */
  nftTokenId?: string;
}

export default BalanceData;
