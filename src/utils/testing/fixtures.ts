import BalanceData from '@gryfyn-types/data-transfer-objects/BalanceData';
import Token, { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import TokenPrice from '@gryfyn-types/data-transfer-objects/TokenPrice';
import { constants } from 'ethers';

export const fixtures = {
  balances: {
    create: (...data: Array<Partial<BalanceData>>): BalanceData[] => {
      const defaultBalanceData: BalanceData = {
        entityId: '0',
        chainId: '0',
        address: constants.AddressZero,
        assetId: 'ASSET',
        assetTicker: 'deprecated',
        balance: constants.WeiPerEther.toString(),
      };

      return data.map((partial) => ({
        ...defaultBalanceData,
        ...partial,
      }));
    },
  },

  tokens: {
    create: (...data: Array<Partial<Token>>): Token[] => {
      const defaultToken: Token = {
        network: {
          chainalysisNetwork: 'NA',
          networkColor: '#FFF',
          pngNetworkIconUrl: 'networkIcon.png',
        },
        standard: TokenStandard.ERC20,
        isNative: false,
        key: '0_ASSET',
        gasLimit: '0x0',
        displayName: 'Asset',
        contractAddress: constants.AddressZero,
        ticker: 'ASSET',
        decimal: 18,
        display: {
          colorCode: '#FFF',
          pngIconUrl: 'displayIcon.png',
          svgIconUrl: 'displayIcon.svg',
        },
        chain: {
          type: 'TESTNET',
          txUrl: 'https://chain.hextrust.io/tx/',
          chainName: 'HexChain',
          addressUrl: 'https://chain.hextrust.io/address/',
          chainID: '0',
          smartContractUrl: 'https://hexscan.io/token/',
          minBlockConfirmation: 5,
        },
        txUrl: 'https://chain.hextrust.io/tx/',
      };

      return data.map((partial) => ({
        ...defaultToken,
        ...partial,
      }));
    },
  },

  prices: {
    create: (...data: Array<Partial<TokenPrice>>): TokenPrice[] => {
      const defaultTokenPrice: TokenPrice = {
        assetKey: 'KEY',
        chainID: '1',
        assetTicker: 'ASSET',
        price: '1',
        platformCurrency: 'ASSET',
        createdAt: Date.now().toString(),
        source: 'Nomics',
      };

      return data.map((partial) => ({
        ...defaultTokenPrice,
        ...partial,
      }));
    },
  },
};
