interface TokenPrice {
  assetKey: string;
  chainID: string;
  assetTicker: string;
  sourceTicker?: string;
  price: string;
  platformCurrency: string;
  source: string;
  createdAt: string;
}

export default TokenPrice;
