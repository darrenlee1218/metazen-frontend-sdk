export enum SupportedTokens {
  ETH_Eth = '1_ETH',
  ETH_Rink = '4_ETH',
  ETH_Goer = '5_ETH',
  WETH_Poly = '137_WETH_0x7ceB23fD',

  MATIC_Poly = '137_MATIC',
  MATIC_Mumbai = '80001_MATIC',
  MATIC_Eth = '1_MATIC_0x7d1afa7b',

  USDC_Eth = '1_USDC_0xA0b86991',
  USDC_Rink = '4_USDC_0xeb8f08a9',
  USDC_Poly = '137_USDC_0x2791Bca1',
  USDC_Mumbai = '80001_USDC_0xe6b8a5CF',

  REVV_Eth = '1_REVV_0x557b933a',
  REVV_Rink = '4_REVV_0xdd337e92',
  REVV_Goer = '5_REVV_0xeaaa8712',
  REVV_Poly = '137_REVV_0x70c00687',
  REVV_Mumbai = '80001_REVV_0x736DF5c1',
}

export enum SupportedNfts {
  REVVM_Poly = '137_REVVM_0x51Ac4A13',
  REVVM_Mumbai = '80001_REVVM_0xc452E413',

  GF_Mumbai = '80001_GNTTM_0x4Aa0CcCf',
  GF_Rink = '4_GFFR_0xd1F8eEEe', // GFN
  GF_Goer = '5_GFFG_0x26d971c3',

  GF_Semi_Rink = '4_GSNR_0x26d971c3', // GFS
  GF_Semi_Goer = '5_GFSFG_0xc1020c99',
}

const getAssetKeysByType = (type: 'all' | 'token' | 'nft'): string[] => {
  switch (type) {
    case 'token':
      return Object.values(SupportedTokens);

    case 'nft':
      return Object.values(SupportedNfts);

    case 'all':
    default:
      return [...Object.values(SupportedTokens), ...Object.values(SupportedNfts)];
  }
};

export const getAssetKeysByChainId = (chainIds: string[], type: 'all' | 'token' | 'nft' = 'all'): string[] => {
  const assetKeys = getAssetKeysByType(type);

  return assetKeys.filter((assetKey) => {
    const [chainId] = assetKey.split('_');
    return chainIds.includes(chainId);
  });
};
