import { useInfiniteQuery } from '@tanstack/react-query';
import RecentActivityItemProps from '@gryfyn-types/props/RecentActivityItemProps';
import { transformTxHistory } from '@utils/transform-tx-history';
import { useGetTokensQuery } from '@redux/api/assetMaster';
import { useMemo } from 'react';
import { getTopNTransactions } from '@services/APIServices/tx-history';
import { GetTopNTransactionsResponse } from '@services/APIServices/tx-history/GetTopNEventResponse';

interface FnData {
  results: GetTopNTransactionsResponse[];
  nextPageIndex: string;
  checkNextPage: boolean;
}

export const useTransactionHistory = (events: number, chain?: string, asset?: string) => {
  const totalTokens = useGetTokensQuery();
  const {
    refetch,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    data: recentHistoryData,
    isError,
  } = useInfiniteQuery<FnData, unknown, RecentActivityItemProps>(
    [
      'mtz_tx_history_GetTopNTransactions',
      { eventsNumber: events, chainId: chain, assetKey: asset, pageParam: undefined },
    ] as const, // query key
    async ({ pageParam, queryKey }) => {
      const { eventsNumber, chainId, assetKey } = queryKey[1] as {
        eventsNumber: number;
        chainId: string;
        assetKey: string;
      };
      // need to check if the end of query is correct becuz useinfinitequery wont print another page for empty array result
      let checkNextPage: boolean = true;
      const results = await getTopNTransactions(eventsNumber, chainId, pageParam, assetKey);

      if (results.length < eventsNumber) {
        checkNextPage = false;
      }
      return { results, nextPageIndex: results.length > 0 ? results[results.length - 1].id : '', checkNextPage };
    }, // fetching function
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.checkNextPage) {
          return lastPage.nextPageIndex;
        }
        return undefined;
      },

      select: (data) => ({
        pages: data.pages.flatMap((x) => transformTxHistory(x.results, totalTokens.data)),
        pageParams: data.pageParams,
      }),
      refetchInterval: 10000,
    },
  );

  return useMemo(
    () => ({ isLoading, recentHistoryData, fetchNextPage, hasNextPage, isError }),
    [isLoading, recentHistoryData, fetchNextPage, hasNextPage, isError],
  );
};
