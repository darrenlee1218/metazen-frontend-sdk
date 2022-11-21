import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';
import { checkHexValue } from '@utils/tx-history';
import { ethers } from 'ethers';
import Token from '@gryfyn-types/data-transfer-objects/Token';
import { GetTopNTransactionsResponse } from '@services/APIServices/tx-history/GetTopNEventResponse';

const transformTxHistory = (
  response: GetTopNTransactionsResponse[],
  tokens: Token[] | undefined,
): RecentActivityItemProps[] => {
  const rtnArray: RecentActivityItemProps[] = [];
  if (!tokens) {
    return [];
  }
  /* eslint-disable complexity */
  response.forEach((data: GetTopNTransactionsResponse) => {
    let rtnData: RecentActivityItemProps | null = null;

    let iconUrl = '';
    let txUrl = '';
    if (!data.spec || data.spec === 'NATIVE') {
      // {
      //   from: "0x3f009302978cc82c6daf06aac49b5716be79ccb9",
      //   to: "0x7aaead91814f2afa781b10a87e461ba32fa7e8e3",
      //   hash: "0x9ccfcec2e175e28f3fcaf7e70d8f3a467e5c54c1b3db512fa6eb6a090e437a7d",
      //   createdAt: "2022-06-27T05:33:25.461Z",
      //   transactionType: "deposit",
      //   status: "completed",
      //   value: "0x016345785d8a0000",
      //   assetTicker: "80001_MATIC",
      //   relevantAddress: ["0x7AaeAD91814f2afA781b10A87e461bA32Fa7E8e3"],
      //   chainId: "80001",
      //   spec: "NATIVE",
      // }

      let assetNameStr = data.assetTicker;
      if (tokens != null) {
        for (const t of tokens) {
          if (t.key === data.assetTicker && t.chain.chainID === data.chainId) {
            iconUrl = t.display.svgIconUrl;
            txUrl = t.chain.txUrl;
            assetNameStr = t.ticker;
          }
        }
      }

      rtnData = {
        id: data.id,
        assetName: assetNameStr,
        when: data.createdAt,
        from: data.from,
        to: data.to,
        amount: data.value,
        iconUrl,
        depositOrWithdrawal: data.transactionType,
        txUrl: txUrl.concat(data.hash),
        spec: data.spec,
        primaryStatus: data.primaryTransactionStatus,
        status: data.secondaryTransactionStatus,
        hash: data.hash,
        assetKey: data.assetTicker,
      };
    } else if (data.spec === 'ERC-20' && data.erc20) {
      // {
      //   from: "0x3f009302978cc82c6daf06aac49b5716be79ccb9",
      //   to: "0x7aaead91814f2afa781b10a87e461ba32fa7e8e3",
      //   hash: "0x9e88ceea5ec49b7263e107c5c7851867a8f7f7206e21299177754a92ee472dc7",
      //   createdAt: "2022-06-28T03:28:10.947Z",
      //   transactionType: "deposit",
      //   status: "completed",
      //   value: "0x00",
      //   assetTicker: "80001_MATIC",
      //   relevantAddress: ["0x7AaeAD91814f2afA781b10A87e461bA32Fa7E8e3"],
      //   chainId: "80001",
      //   spec: "ERC-20",
      //   erc20: { assetSymbol: "USDC", assetKey: "80001_USDC_0xe6b8a5CF", tokenTransfered: "0x03e8", decimal: 6 },
      // },

      let assetNameStr = data.erc20.assetSymbol;

      if (tokens != null) {
        for (const t of tokens) {
          if (t.key === data.erc20.assetKey && t.chain.chainID === data.chainId) {
            iconUrl = t.display.svgIconUrl;
            txUrl = t.chain.txUrl;
            assetNameStr = t.ticker;
          }
        }
      }

      rtnData = {
        id: data.id,
        assetName: assetNameStr,
        when: data.createdAt,
        from: data.from,
        to: data.to,
        amount: data.erc20.tokenTransferred,
        iconUrl,
        depositOrWithdrawal: data.transactionType,
        txUrl: txUrl.concat(data.hash),
        spec: data.spec,
        primaryStatus: data.primaryTransactionStatus,
        status: data.secondaryTransactionStatus,
        hash: data.hash,
        assetKey: data.erc20.assetKey,
        chainId: data.chainId,
      };
    } else if (data.spec === 'ERC-1155' && data.erc1155) {
      // {
      //   from: "0xe84d601e5d945031129a83e5602be0cc7f182cf3",
      //   to: "0x7aaead91814f2afa781b10a87e461ba32fa7e8e3",
      //   hash: "0x671be983e3433b6fc6204f5cd4a2ed6b77761f8b32b3b50db7badf7ec68842c8",
      //   createdAt: "2022-06-28T03:46:03.636Z",
      //   transactionType: "deposit",
      //   status: "completed",
      //   value: "0x00",
      //   assetTicker: "80001_MATIC",
      //   relevantAddress: ["0x7AaeAD91814f2afA781b10A87e461bA32Fa7E8e3"],
      //   chainId: "80001",
      //   spec: "ERC-1155",
      //   contractAddress: "0xA07e45A987F19E25176c877d98388878622623FA",
      //   erc1155: {
      //     "assetKey": "80001_DUSTP_0x8995a88F",
      //     "assetSymbol": "DUSTP",
      //     "tokenID": "1",
      //     "contractAddress": "0x8995a88F5D5E5A214fC27D7bA002fB000177f7Bf",
      //     "tokenTransferred": "0x1",
      //     "data": "0x00"
      //   },
      // }

      // i need to take assetkey and call assetMaster_getAssetsResponse GOLD

      const amount = ethers.utils.formatUnits(checkHexValue(data.erc1155.tokenTransferred), 0);
      let assetNameStr = `Number #: ${data.erc1155.tokenID}`;
      let amountStr = `${data.erc1155.assetSymbol} Number # ${data.erc1155.tokenID}`;

      if (tokens) {
        for (const t of tokens) {
          if (t.key === data.erc1155.assetKey) {
            iconUrl = t.display.svgIconUrl;
            txUrl = t.chain.txUrl;
            amountStr = `${amount}`;
            assetNameStr = ` ${t.ticker}`;
          }
        }
      }

      rtnData = {
        id: data.id,
        assetName: assetNameStr,
        when: data.createdAt,
        from: data.from,
        to: data.to,
        amount: amountStr,
        iconUrl,
        depositOrWithdrawal: data.transactionType,
        txUrl: txUrl.concat(data.hash),
        spec: data.spec,
        primaryStatus: data.primaryTransactionStatus,
        status: data.secondaryTransactionStatus,
        hash: data.hash,
        assetKey: data.erc1155.assetKey,
        chainId: data.chainId,
        contractAddress: data.erc1155.contractAddress,
        tokenID: data.erc1155.tokenID,
      };
    } else if (data.spec === 'ERC-721' && data.erc721) {
      // {
      //   from: "0xf749f59738015c0b6d6d184ff814111893c7257d",
      //   to: "0x7aaead91814f2afa781b10a87e461ba32fa7e8e3",
      //   hash: "0x3b176aca93c021b7b8f5f9d4ed367ecfe823a0e35a428bf8e938a12865922e3e",
      //   createdAt: "2022-06-29T03:11:45.03Z",
      //   transactionType: "deposit",
      //   status: "completed",
      //   value: "0x00",
      //   assetTicker: "80001_MATIC",
      //   relevantAddress: ["0x7AaeAD91814f2afA781b10A87e461bA32Fa7E8e3"],
      //   chainId: "80001",
      //   spec: "ERC-721",
      //   contractAddress: "0xA1A6bbB60Bf86bd70060a303deBe4633726cDA55",
      //   erc721: {
      //     "assetKey": "80001_GNTTM_0x4Aa0CcCf",
      //     "assetSymbol": "GNTTM",
      //     "owner": "0xF3B565D06A7bacD8ae960363331dCe229DC590b4",
      //     "tokenID": "232131233213",
      //     "tokenURI": "https://asset-token-metadata-stg.revvmotorsport.com/57910179610855900031866204803652725946568817000367758305397667012496444117182",
      //     "contractAddress": "0x4Aa0CcCf4Ab16d593863efC05c79157eAaB0FA83"
      //   },
      // },

      let assetNameStr = `Number #: ${data.erc721.tokenID}`;

      if (tokens != null) {
        for (const t of tokens) {
          if (t.key === data.erc721.assetKey) {
            // console.log('AssetMaster', t);
            iconUrl = t.display.svgIconUrl;
            txUrl = t.chain.txUrl;
            assetNameStr = `${t.ticker} #${data.erc721.tokenID}`;
          }
        }
      }

      rtnData = {
        id: data.id,
        assetName: assetNameStr,
        when: data.createdAt,
        from: data.from,
        to: data.to,
        amount: '',
        iconUrl,
        depositOrWithdrawal: data.transactionType,
        txUrl: txUrl.concat(data.hash),
        spec: data.spec,
        primaryStatus: data.primaryTransactionStatus,
        status: data.secondaryTransactionStatus,
        hash: data.hash,
        assetKey: data.erc721.assetKey,
        chainId: data.chainId,
        contractAddress: data.erc721.contractAddress,
        tokenID: data.erc721.tokenID,
      };
    }

    if (rtnData !== null) {
      rtnArray.push(rtnData);
    }
  });

  // const groupByCategory = groupBy(rtnArray, 'hash');

  // const groupedrtnArray = Object.values(groupByCategory);

  return rtnArray.sort((b, a) => {
    if (new Date(a.when) > new Date(b.when)) {
      return 1;
    }
    if (new Date(a.when) < new Date(b.when)) {
      return -1;
    }
    return 0;
  });
};

export { transformTxHistory };
