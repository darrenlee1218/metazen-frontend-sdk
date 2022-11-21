import { useCallback, useMemo } from 'react';
import { utils } from 'ethers';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { selectRelevantTokens, checkJoinTokenLists } from '@redux/selector';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useGetBalancesQuery } from '@redux/api/bookKeeping';
import { useGetPricesQuery } from '@redux/api/assetEvaluator';

import { Comparator } from '@gryfyn-types/generics';
import { TokenStandard } from '@gryfyn-types/data-transfer-objects/Token';
import TokenBalance from '@gryfyn-types/data-transfer-objects/TokenBalance';

import { keyBy } from '@utils/keyBy';
import { API_CONSTANTS } from '@constants/api';

export const useTokenBalances = () => {
  const relevantTokens = useSelector(selectRelevantTokens);
  const checkJoinTokens = useSelector(checkJoinTokenLists);

  const { data: tokens, isLoading: isLoadingTokens, isError: isLoadTokensError } = useGetTokensQuery();
  const { data: balances, isError: isLoadBalanceError } = useGetBalancesQuery(undefined, {
    pollingInterval: API_CONSTANTS.ASSET_POLLING_INTERVAL_MS,
  });

  const filteredTokensByStandard = useMemo(
    () => (tokens ?? []).filter((token) => [TokenStandard.NATIVE, TokenStandard.ERC20].includes(token.standard)),
    [tokens],
  );

  const assetKeyTokenMap = useMemo(() => keyBy(filteredTokensByStandard, 'key'), [filteredTokensByStandard]);
  const assetKeyBalanceMap = useMemo(() => keyBy(balances ?? [], 'assetId'), [balances]);

  const allAssetKeys = useMemo(() => {
    // SELECT token.key FROM balances INNER JOIN tokens ON balances.assetId = tokens.key
    const balanceAssetKeys = (balances ?? [])
      .filter((b) => Boolean(assetKeyTokenMap[b.assetId]))
      .map((b) => assetKeyTokenMap[b.assetId].key);

    return Array.from(new Set(relevantTokens.concat(balanceAssetKeys)));
  }, [balances, relevantTokens, assetKeyTokenMap]);

  const { data: prices, isError: isLoadPricesError } = useGetPricesQuery(allAssetKeys, {
    pollingInterval: API_CONSTANTS.EVALUATOR_POLLING_INTERVAL_MS,
  });

  const keyPricesMap = useMemo(() => keyBy(prices ?? [], 'assetKey'), [prices]);

  const tokenBalances = useMemo(
    () =>
      filteredTokensByStandard.map<TokenBalance>((token) => {
        const amountBigNum = new BigNumber(
          utils.formatUnits(assetKeyBalanceMap[token.key]?.balance ?? '0', token.decimal),
        );
        // potential issue here, e.g. how do we handle USDC on MATIC and USDC on BSC?
        const tokenPriceUsd = keyPricesMap[token.key]?.price;
        const amountUsdValue = tokenPriceUsd ? amountBigNum.times(tokenPriceUsd).toString() : undefined;

        return {
          token,
          price: tokenPriceUsd,
          amount: amountBigNum.toString(),
          amountUsdValue,
          balanceInAssetDecimals: assetKeyBalanceMap[token.key]?.balance ?? '0',
        };
      }),
    [assetKeyBalanceMap, keyPricesMap, filteredTokensByStandard],
  );

  const isRelevantToken = useCallback(
    ({ token }: TokenBalance) => relevantTokens.find((tokenKey) => token.key === tokenKey),
    [relevantTokens],
  );

  const isNotRelevantToken = useCallback((tb: TokenBalance) => !isRelevantToken(tb), [isRelevantToken]);

  const defaultTokenList = useMemo(
    () => [
      ...tokenBalances.filter(isRelevantToken),
      ...tokenBalances.filter(isNotRelevantToken).filter((tb) => new BigNumber(tb.amount).isGreaterThan(0)),
    ],
    [tokenBalances, isRelevantToken, isNotRelevantToken],
  );

  const gameTokensSort = useCallback<Comparator<TokenBalance>>(
    ({ token: tokenA }, { token: tokenB }) => {
      return (
        relevantTokens.findIndex((tokenKey) => tokenA.key === tokenKey) -
        relevantTokens.findIndex((tokenKey) => tokenB.key === tokenKey)
      );
    },
    [relevantTokens],
  );

  const totalUsdValueSort = useCallback<Comparator<TokenBalance>>(
    ({ amountUsdValue: totalUsdValueA }, { amountUsdValue: totalUsdValueB }) =>
      new BigNumber(totalUsdValueB ?? Number.MAX_SAFE_INTEGER).comparedTo(
        new BigNumber(totalUsdValueA ?? Number.MAX_SAFE_INTEGER),
      ),
    [],
  );

  return useMemo(
    () => ({
      isLoading: isLoadingTokens,
      isLoadTokenError: isLoadTokensError,
      isLoadBalanceError,
      isLoadPricesError,
      // Note: This field won't be ordered properly
      allTokenBalances: tokenBalances,
      relevantTokenBalances: checkJoinTokens
        ? defaultTokenList.sort(gameTokensSort)
        : tokenBalances.filter(isRelevantToken).sort(gameTokensSort),
      otherTokenBalances: checkJoinTokens
        ? []
        : tokenBalances
            .filter(isNotRelevantToken)
            .filter((tb) => new BigNumber(tb.amount).isGreaterThan(0))
            .sort(totalUsdValueSort),
    }),
    [
      isLoadingTokens,
      isLoadTokensError,
      isLoadBalanceError,
      isLoadPricesError,
      tokenBalances,
      checkJoinTokens,
      defaultTokenList,
      isRelevantToken,
      gameTokensSort,
      isNotRelevantToken,
      totalUsdValueSort,
    ],
  );
};
