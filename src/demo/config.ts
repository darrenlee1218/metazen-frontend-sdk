import { WalletConfig } from '@gryfyn-types/props/WalletProps';
import { getAssetKeysByChainId, SupportedNfts, SupportedTokens } from '@gryfyn-types/supported-assets';

import GryfynDark from './assets/standalone/gryfyn-banner-dark.svg';

import revvRacingLogoSrc from './assets/revv-racing/Revv-Racing-Logo.svg';
import revvRacingBackgroundSrc from './assets/revv-racing/Revv-Racing-Background.png';
import revvRacingBrandTextSrc from './assets/revv-racing/Revv-Racing-Brand-Text.svg';
import gryFynLogoSrc from './assets/revv-racing/Gryfyn-Logo.svg';

import dustlandRunnerLogoSrc from './assets/dustland-runner/Dustland-Runner-Logo.svg';
import dustlandRunnerBackgroundSrc from './assets/dustland-runner/Dustland-Runner-Background.jpeg';

export type DemoConfigs = Record<string, WalletConfig>;

const REACT_APP_USE_MAINNET = (process.env.REACT_APP_USE_MAINNET ?? '').toLowerCase() === 'true';
const chainIds = REACT_APP_USE_MAINNET ? ['1', '137'] : ['4', '5', '80001'];
const mainnetPrimaryChainIdList = ['137'];
const testnetPrimaryChainIdList = ['80001'];

export const demoConfigs: DemoConfigs = {
  standalone: {
    primaryChainId: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    supportedNetworks: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    hostName: 'gryfyn',
    relevantTokens: REACT_APP_USE_MAINNET
      ? [SupportedTokens.ETH_Eth, SupportedTokens.MATIC_Poly]
      : [SupportedTokens.ETH_Goer, SupportedTokens.MATIC_Mumbai],
    relevantNfts: REACT_APP_USE_MAINNET ? [SupportedNfts.REVVM_Poly] : getAssetKeysByChainId(chainIds, 'nft'),
    gameIconUrl: '',
    additionalPalette: {
      colors: {
        clickableGray: 'rgba(32, 32, 32, 0.4)',
      },
    },
    width: '100%',
    height: '100%',
    homeBackground: GryfynDark,
    tabWhitelist: ['/', '/game-rewards', '/recent-activity', '/account'],
    companyIconUrl: gryFynLogoSrc,
    qrScannerEnabled: false,
    joinTokenLists: true,
    joinCollectionLists: true,
  },
  treasurehunt: {
    primaryChainId: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    supportedNetworks: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    hostName: 'treasurehunt',
    relevantTokens: REACT_APP_USE_MAINNET
      ? [SupportedTokens.ETH_Eth, SupportedTokens.MATIC_Poly]
      : [SupportedTokens.ETH_Goer, SupportedTokens.MATIC_Mumbai],
    relevantNfts: REACT_APP_USE_MAINNET ? [SupportedNfts.REVVM_Poly] : getAssetKeysByChainId(chainIds, 'nft'),
    gameIconUrl: '',
    width: '100%',
    height: '100%',
    homeBackground: GryfynDark,
    tabWhitelist: ['/', '/game-rewards', '/recent-activity', '/account'],
    companyIconUrl: gryFynLogoSrc,
    qrScannerEnabled: false,
    joinTokenLists: true,
    joinCollectionLists: true,
  },
  revv: {
    hostName: 'gryfyn-revv',
    primaryChainId: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    supportedNetworks: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    relevantTokens: REACT_APP_USE_MAINNET
      ? [SupportedTokens.REVV_Poly, SupportedTokens.MATIC_Poly]
      : [SupportedTokens.REVV_Mumbai, SupportedTokens.MATIC_Mumbai],
    relevantNfts: REACT_APP_USE_MAINNET ? [SupportedNfts.REVVM_Poly] : [SupportedNfts.REVVM_Mumbai],
    gameIconUrl: revvRacingLogoSrc,
    additionalPalette: {
      primary: {
        main: '#E24B5E',
      },
      colors: {
        hoverColor: '#FB6B7D',
        disabledColor: '#A13E4A',
      },
    },
    tabWhitelist: ['/', '/game-rewards', '/recent-activity', '/account'],
    width: '100%',
    height: '100%',
    homeBackground: revvRacingBackgroundSrc,
    brandTextSvg: revvRacingBrandTextSrc,
    companyIconUrl: gryFynLogoSrc,
    qrScannerEnabled: false,
    joinTokenLists: false,
    joinCollectionLists: false,
  },
  dustland: {
    hostName: 'gryfyn-dustland',
    primaryChainId: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    supportedNetworks: REACT_APP_USE_MAINNET ? mainnetPrimaryChainIdList : testnetPrimaryChainIdList,
    relevantTokens: [],
    relevantNfts: [],
    gameIconUrl: dustlandRunnerLogoSrc,
    companyIconUrl: gryFynLogoSrc,
    tabWhitelist: ['/', '/recent-activity'],
    additionalPalette: {
      primary: {
        main: '#FE4800',
      },
      colors: {
        hoverColor: '#FF7D34',
        disabledColor: '#C5592E',
      },
    },
    width: '100%',
    height: '100%',
    homeBackground: dustlandRunnerBackgroundSrc,
    qrScannerEnabled: false,
    joinTokenLists: false,
    joinCollectionLists: false,
  },
  default_theme: {
    primaryChainId: [],
    supportedNetworks: [],
    hostName: 'gryfyn-default',
    relevantTokens: getAssetKeysByChainId(chainIds, 'token'),
    relevantNfts: getAssetKeysByChainId(chainIds, 'nft'),
    gameIconUrl: '',
    width: '100%',
    height: '100%',
    homeBackground: gryFynLogoSrc,
    tabWhitelist: ['/', '/game-rewards', '/recent-activity', '/account'],
    companyIconUrl: gryFynLogoSrc,
    qrScannerEnabled: false,
    joinTokenLists: true,
    joinCollectionLists: true,
  },
};
