export class AssetKey {
  key: string;
  chainId: string;
  ticker: string;

  constructor(key: string) {
    this.key = key;
    [this.chainId, this.ticker] = this.key.split('_');
  }
}
